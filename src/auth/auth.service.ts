import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { catchError, firstValueFrom } from 'rxjs';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, TiendanubeAuthRequest, TiendanubeAuthResponse } from './dto';
import { TiendanubeUser } from '@prisma/client';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private axios: HttpService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const isPasswordValid = await bcrypt.compare(dto.password, user.hash);
    if (!isPasswordValid) throw new ForbiddenException('Credentials incorrect');

    delete user.hash;
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
    fields: { [key: string]: any } = {},
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, ...fields };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
      secret,
    });

    return {
      access_token: token,
    };
  }

  async tiendanubeInstall(code: string) {
    if (!code) throw new BadRequestException('Code not found');

    const body: TiendanubeAuthRequest = {
      client_id: this.config.get('CLIENT_ID'),
      client_secret: this.config.get('CLIENT_SECRET'),
      grant_type: 'authorization_code',
      code: code,
    };
    const { data: authRes } = await firstValueFrom(
      this.axios
        .post<TiendanubeAuthResponse>(
          this.config.get('TIENDANUBE_AUTENTICATION_URL'),
          body,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );

    if (authRes.error) throw new BadRequestException(authRes.error_description);

    const user: TiendanubeUser = await this.prisma.tiendanubeUser.findUnique({
      where: {
        userId: authRes.user_id,
      },
    });

    if (user) return this.tiendanubeSignin(user, authRes);
    return this.tiendanubeSignup(authRes);
  }

  async tiendanubeSignin(
    dbUser: TiendanubeUser,
    authUser: TiendanubeAuthResponse,
  ) {
    try {
      await this.prisma.tiendanubeUser.update({
        where: {
          id: dbUser.id,
        },
        data: {
          accessToken: authUser.access_token,
        },
      });

      return this.signToken(dbUser.id, dbUser.email, { userId: dbUser.userId });
    } catch (error) {
      throw new BadRequestException('Failed to update user access token');
    }
  }

  async tiendanubeSignup(authUser: TiendanubeAuthResponse) {
    try {
      const url = `${this.config.get('TIENDANUBE_API_URL')}/${
        authUser.user_id
      }/store?fields=email`;

      const {
        data: { email },
      } = await firstValueFrom(
        this.axios.get<{ email: string }>(url, {
          headers: {
            Authentication: `${authUser.token_type} ${authUser.access_token}`,
          },
        }),
      );

      const newUser = await this.prisma.tiendanubeUser.create({
        data: {
          email,
          userId: authUser.user_id,
          accessToken: authUser.access_token,
        },
      });

      delete newUser.accessToken;
      return this.signToken(newUser.id, newUser.email, {
        userId: newUser.userId,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
