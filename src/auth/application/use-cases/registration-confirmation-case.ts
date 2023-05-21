import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../user/entities/user.entity';
import { UserRepository } from '../../../user/user.repository';
import { errorMaker } from '../../../helpers/errors';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const userFind: User | null =
      await this.userRepository.findUserByConfirmationCode(command.code);

    if (
      !userFind &&
      userFind.emailConfirmation.isConfirmed &&
      userFind.emailConfirmation.confirmationCode !== command.code &&
      userFind.emailConfirmation.expirationDate < new Date()
    )
      return {
        s: 400,
        mf: errorMaker([
          'If the confirmation code is incorrect, expired or already been applied',
          'code',
        ]),
      };

    try {
      await this.userRepository.updateConfirmation(userFind._id.toString());
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
