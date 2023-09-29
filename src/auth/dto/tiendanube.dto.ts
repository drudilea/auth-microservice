import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class TiendanubeAuthRequest {
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;

  @IsNotEmpty()
  @IsString()
  grant_type: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class TiendanubeAuthResponse {
  @IsOptional()
  @IsString()
  access_token: string;

  @IsOptional()
  @IsString()
  token_type: string;

  @IsOptional()
  @IsString()
  scope: string;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  error: string;

  @IsOptional()
  @IsString()
  error_description: string;
}
