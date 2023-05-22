import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../db/user.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand) {
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
