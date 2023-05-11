import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrationConfirmationCode {
  @IsNotEmpty()
  @IsString()
  code: string;
}
