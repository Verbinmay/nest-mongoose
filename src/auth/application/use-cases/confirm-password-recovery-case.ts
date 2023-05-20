import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../../../user/user.repository';
import { NewPassword } from '../../dto/input-newpassword.dto';

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
    if (!userFind) {
      return false;
    }
    if (
      userFind.emailConfirmation.confirmationCode !==
      command.inputModel.recoveryCode
    ) {
      return false;
    }
    if (userFind.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    const hashBcrypt = await bcrypt.hash(command.inputModel.newPassword, 10);
    return await this.userRepository.updateConfirmationAndHash({
      id: userFind._id.toString(),
      hash: hashBcrypt,
    });
  }
}
