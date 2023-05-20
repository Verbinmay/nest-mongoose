import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../user/user.repository';
import { randomUUID } from 'crypto';
import { MailService } from '../../../mail/mail.service';
import { AuthRepository } from '../../auth.repository';
import { add } from 'date-fns';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private authRepository: AuthRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const confirmationCode = randomUUID().toString();
    const userFind = await this.userRepository.findUserByEmail(command.email);
    if (!userFind) return false;

    await this.mailService.sendUserConfirmation(
      command.email,
      userFind.login,
      confirmationCode,
    );
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });
    const userUpdate: boolean = await this.authRepository.updateCodeAndDate({
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
      user: userFind,
    });
    return userUpdate;
  }
}
