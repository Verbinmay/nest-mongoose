import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../db/user.repository';
import { User } from '../../../entities/user.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorUser } from '../../../pagination/paginatorType';
import { SAViewUserDto } from '../../dto/user/sa-view-user.dto';

export class SA_GetAllUsersCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(SA_GetAllUsersCommand)
export class SA_GetAllUsersCase
  implements ICommandHandler<SA_GetAllUsersCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: SA_GetAllUsersCommand) {
    let filter: object = {};

    filter = {
      $and: [
        {
          login: { $regex: command.query.searchLoginTerm, $options: 'i' },
        },
        {
          email: { $regex: command.query.searchEmailTerm, $options: 'i' },
        },
        {
          'banInfo.isBanned': { $in: command.query.createBunStatus() },
        },
      ],
    };

    const filterSort: { [x: string]: number } = command.query.sortFilter();

    const totalCount = await this.userRepository.findCountUsers(filter);

    const pagesCount = command.query.countPages(totalCount);

    const usersFromDB: User[] = await this.userRepository.findUsers({
      find: filter,
      sort: filterSort,
      skip: command.query.skip(),
      limit: command.query.pageSize,
    });
    console.log(usersFromDB);

    const users: SAViewUserDto[] = usersFromDB.map((m) => m.SAGetViewModel());

    const result: PaginatorUser = {
      pagesCount: pagesCount,
      page: command.query.pageNumber,
      pageSize: command.query.pageSize,
      totalCount: totalCount,
      items: users,
    };

    return result;
  }
}
