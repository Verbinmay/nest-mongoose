import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../db/user.repository';

export class SA_DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(SA_DeleteUserCommand)
export class SA_DeleteUserCase
  implements ICommandHandler<SA_DeleteUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: SA_DeleteUserCommand) {
    const user = await this.userRepository.findUserById(command.id);
    if (!user) {
      return { s: 404 };
    }
    const userDelete = await this.userRepository.delete(command.id);
    if (!userDelete) {
      return { s: 500 };
    }
    return userDelete;
  }
}
