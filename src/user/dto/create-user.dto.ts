import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { ValidationLoginEmail } from '../../validation/validationLoginEmail';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Validate(ValidationLoginEmail, {
    message: 'Login like that is already exist',
  })
  login: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(ValidationLoginEmail, {
    message: 'Email like that is already exist',
  })
  email: string;
}
