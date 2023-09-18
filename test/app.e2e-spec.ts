import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Do everything is done in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // remove all fields that are not in the DTO
      }),
    );
    await app.init();
    app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@yopmail.com',
      password: '123456',
    };
    describe('Signup', () => {
      it('should fail if email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: 'notvalidemail' })
          .expectStatus(400);
      });
      it('should fail if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });
      it('should fail if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should fail if email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, email: 'notvalidemail' })
          .expectStatus(400);
      });
      it('should fail if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });
      it('should fail if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{token}')
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'test2@yopmail.com',
          firstName: 'John',
        };

        return pactum
          .spec()
          .patch('/users')
          .withBearerToken('$S{token}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
});
