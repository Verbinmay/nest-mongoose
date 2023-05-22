import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserRepository } from '../../../db/user.repository';
import { User } from '../../../entities/user.entity';

export class CreateUserCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    // await validateOrRejectModel(inputModel, CreateUserDto);

    const hashBcrypt = await bcrypt.hash(command.inputModel.password, 10);

    const user: User = new User(command.inputModel, hashBcrypt);

    user.emailConfirmation.isConfirmed = true;

    const result = await this.userRepository.save(user);

    return result.SAGetViewModel();
  }
}

// async function validateOrRejectModel(
//   inputModel: any,
//   classForm: { new (): any },
// ) {
//   if (inputModel instanceof classForm === false) {
//     throw new Error('Incorrect input data');
//   }
//   try {
//     await validateOrReject(inputModel);
//   } catch (error) {
//     throw new Error(error);
//   }
// }
