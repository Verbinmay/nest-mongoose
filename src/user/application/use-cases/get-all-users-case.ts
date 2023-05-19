import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../user.repository';
import { User } from '../../entities/user.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { ViewUserDto } from '../../dto/view-user.dto';
import { PaginatorUser } from '../../../pagination/paginatorType';

export class GetAllUsersCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(GetAllUsersCommand)
export class GetAllUsersCase implements ICommandHandler<GetAllUsersCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: GetAllUsersCommand) {
    let filter: object = {};
    if (command.query.searchLoginTerm || command.query.searchEmailTerm) {
      filter = {
        $or: [
          {
            login: { $regex: '(?i)' + command.query.searchLoginTerm + '(?-i)' },
          },
          {
            email: { $regex: '(?i)' + command.query.searchEmailTerm + '(?-i)' },
          },
        ],
      };
    } else if (command.query.searchLoginTerm) {
      filter = {
        login: { $regex: '(?i)' + command.query.searchLoginTerm + '(?-i)' },
      };
    } else if (command.query.searchEmailTerm) {
      filter = {
        email: { $regex: '(?i)' + command.query.searchEmailTerm + '(?-i)' },
      };
    } else {
      filter = {};
    }

    const filterSort: { [x: string]: number } = command.query.sortFilter();

    const totalCount = await this.userRepository.findCountUsers(filter);

    const pagesCount = command.query.countPages(totalCount);

    const usersFromDB: User[] = await this.userRepository.findUsers({
      find: filter,
      sort: filterSort,
      skip: command.query.skip(),
      limit: command.query.pageSize,
    });

    const users: ViewUserDto[] = usersFromDB.map((m) => m.getViewModel());

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
