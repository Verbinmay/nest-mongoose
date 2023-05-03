import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { validateOrReject } from 'class-validator';
import { UserRepository } from './user.repository';
import { randomUUID } from 'crypto';
import add from 'date-fns/add';
import { User } from './entities/user.entity';
import { PaginationQuery } from 'src/pagination/base-pagination';
import { ViewUserDto } from './dto/view-user.dto';
import { PaginatorUser } from 'src/pagination/paginatorType';

async function validateOrRejectModel(
  inputModel: any,
  classForm: { new (): any },
) {
  if (inputModel instanceof classForm === false) {
    throw new Error('Incorrect input data');
  }
  try {
    await validateOrReject(inputModel);
  } catch (error) {
    throw new Error(error);
  }
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(inputModel: CreateUserDto) {
    await validateOrRejectModel(inputModel, CreateUserDto);

    const hashBcrypt = await bcrypt.hash(inputModel.password, 10);
    const confirmationCode = randomUUID();

    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });

    const user: User = User.createUser(
      inputModel,
      confirmationCode,
      expirationDate,
      hashBcrypt,
    );

    user.emailConfirmation.isConfirmed = true;

    const result = await this.userRepository.save(user);

    return result.getViewModel();
  }

  async getUsers(query: PaginationQuery) {
    let filter: object = {};
    if (query.searchLoginTerm || query.searchEmailTerm) {
      filter = {
        $or: [
          { login: { $regex: '(?i)' + query.searchLoginTerm + '(?-i)' } },
          { email: { $regex: '(?i)' + query.searchEmailTerm + '(?-i)' } },
        ],
      };
    } else if (query.searchLoginTerm) {
      filter = {
        login: { $regex: '(?i)' + query.searchLoginTerm + '(?-i)' },
      };
    } else if (query.searchEmailTerm) {
      filter = {
        email: { $regex: '(?i)' + query.searchEmailTerm + '(?-i)' },
      };
    } else {
      filter = {};
    }

    const filterSort: { [x: string]: number } = query.sortFilter();

    const totalCount = await this.userRepository.findCountUsers(filter);

    const pagesCount = query.countPages(totalCount);

    const usersFromDB: User[] = await this.userRepository.findUsers({
      find: filter,
      sort: filterSort,
      skip: query.skip(),
      limit: query.pageSize,
    });

    const users: ViewUserDto[] = usersFromDB.map((m) => m.getViewModel());

    const result: PaginatorUser = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: users,
    };

    return result;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.userRepository.delete(id);
  }
}
