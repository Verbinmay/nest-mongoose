import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../../../user/user.repository';
import { NewPassword } from '../../dto/input-newpassword.dto';
import { errorMaker } from '../../../helpers/errors';

export class ConfirmPasswordRecoveryCommand {
  constructor(public inputModel: NewPassword) {}
}

@CommandHandler(ConfirmPasswordRecoveryCommand)
export class ConfirmPasswordRecoveryCase
  implements ICommandHandler<ConfirmPasswordRecoveryCommand>
{
  constructor(private userRepository: UserRepository) {}

  async execute(command: ConfirmPasswordRecoveryCommand) {
    const userFind = await this.userRepository.findUserByConfirmationCode(
      command.inputModel.recoveryCode,
    );
    if (
      !userFind &&
      userFind.emailConfirmation.confirmationCode !==
        command.inputModel.recoveryCode &&
      userFind.emailConfirmation.expirationDate < new Date()
    ) {
      return {
        s: 400,
        mf: errorMaker([
          'If the confirmation code is incorrect, expired or already been applied',
          'recoveryCode',
        ]),
      };
    }

    const hashBcrypt = await bcrypt.hash(command.inputModel.newPassword, 10);
    return await this.userRepository.updateConfirmationAndHash({
      id: userFind._id.toString(),
      hash: hashBcrypt,
    });
  }
}
