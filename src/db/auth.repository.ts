import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  // UPDATE EMAIL REGISTRATION NEW CODE RETURN USER
  async updateCodeAndDate(a: {
    confirmationCode: string;
    expirationDate: Date;
    user: any;
  }) {
    try {
      a.user.emailConfirmation.confirmationCode = a.confirmationCode;
      a.user.emailConfirmation.expirationDate = a.expirationDate;
      a.user.save();

      return true;
    } catch (error) {
      return false;
    }
  }
}
