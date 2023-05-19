import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../user.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.userRepository.findUserById(command.id);
    if (!user) {
      return 'Error 404';
    }
    const userDelete = await this.userRepository.delete(command.id);
    if (!userDelete) {
      return 'Error 404';
    }
    return userDelete;
  }
}
