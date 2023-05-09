// @injectable()
// export class AuthRepository {
//   //FIND USER BY CONFIRM CODE
//   async findUserByConfirmationCode(code: string) {
//     const result: UserDBModel | null = await UserModelClass.findOne({
//       'emailConfirmation.confirmationCode': code,
//     }).lean();
//     return result;
//   }

//   //UPDATE CONFIRMATION
//   async updateConfirmation(id: string) {
//     try {
//       const result = await UserModelClass.findById(id);

//       if (!result) return false;

//       result.emailConfirmation.isConfirmed = true;

//       result.save();

//       return true;
//     } catch (e) {
//       return false;
//     }
//   }

//   //UPDATE CONFIRMATION
//   async updateConfirmationAndHash(a: { id: string; hash: string }) {
//     try {
//       const result = await UserModelClass.findById(a.id);

//       if (!result) return false;

//       result.emailConfirmation.isConfirmed = true;
//       result.hash = a.hash;
//       result.save();

//       return true;
//     } catch (e) {
//       return false;
//     }
//   }

//   //FIND USER BY EMAIL
//   async findUserByEmail(email: string) {
//     try {
//       return UserModelClass.findOne({
//         email: email,
//       });
//     } catch (e) {
//       return null;
//     }
//   }

//   // UPDATE EMAIL REGISTRATION NEW CODE RETURN USER
//   async updateCodeAndDate(a: {
//     confirmationCode: string;
//     expirationDate: Date;
//     user: any;
//   }) {
//     a.user.emailConfirmation.confirmationCode = a.confirmationCode;
//     a.user.emailConfirmation.expirationDate = a.expirationDate;
//     a.user.save();

//     return true;
//   }
// }
