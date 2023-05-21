import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../user/user.repository';
import { MailService } from '../../../mail/mail.service';
import { AuthRepository } from '../../auth.repository';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class ResendingEmailCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendingEmailCommand)
export class ResendingEmailCase
  implements ICommandHandler<ResendingEmailCommand>
{
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private authRepository: AuthRepository,
  ) {}

  async execute(command: ResendingEmailCommand) {
    const userFind = await this.userRepository.findUserByEmail(command.email);
    console.log(userFind, 'userFind');
    if (!userFind) {
      return false;
    }

    if (userFind.emailConfirmation.isConfirmed) {
      return false;
    }

    const confirmationCode = randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });

    const userUpdate: boolean = await this.authRepository.updateCodeAndDate({
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
      user: userFind,
    });

    if (!userUpdate) return false;

    await this.mailService.sendUserConfirmation(
      command.email,
      userFind.login,
      confirmationCode,
    );

    return true;
  }
}
