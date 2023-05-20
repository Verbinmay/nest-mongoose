import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import * as bcrypt from 'bcrypt';
import { User } from '../../../user/entities/user.entity';
import { UserRepository } from '../../../user/user.repository';
import { MailService } from '../../../mail/mail.service';
import { CreateUserDto } from '../../../user/dto/create-user.dto';

export class RegistrationCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async execute(command: RegistrationCommand) {
    const hashBcrypt = await bcrypt.hash(command.inputModel.password, 10);

    const user: User = new User(command.inputModel, hashBcrypt);

    await this.userRepository.save(user);

    await this.mailService.sendUserConfirmation(
      command.inputModel.email,
      command.inputModel.login,
      user.emailConfirmation.confirmationCode,
    );

    return true;
  }
}
