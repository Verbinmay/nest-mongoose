import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../user/entities/user.entity';
import { UserRepository } from '../../../user/user.repository';

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

    if (!userFind) {
      return false;
    }

    if (userFind.emailConfirmation.isConfirmed) {
      return false;
    }

    if (userFind.emailConfirmation.confirmationCode !== command.code) {
      return false;
    }

    if (userFind.emailConfirmation.expirationDate < new Date()) {
      return false;
    }

    return await this.userRepository.updateConfirmation(
      userFind._id.toString(),
    );
  }
}
