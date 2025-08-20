import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payloadToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payload: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}
