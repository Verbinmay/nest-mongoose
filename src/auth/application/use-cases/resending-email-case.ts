import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../db/user.repository';
import { MailService } from '../../../mail/mail.service';
import { AuthRepository } from '../../../db/auth.repository';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { errorMaker } from '../../../helpers/errors';

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

    if (!userFind && userFind.emailConfirmation.isConfirmed) {
      return {
        s: 400,
        mf: errorMaker([
          ' inputModel has incorrect values or if email is already confirmed',
          'email',
        ]),
      };
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

    if (!userUpdate) return { s: 500 };

    await this.mailService.sendUserConfirmation(
      command.email,
      userFind.login,
      confirmationCode,
    );

    return true;
  }
}
