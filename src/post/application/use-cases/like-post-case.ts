import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeDto } from '../../../likes/dto/like.dto';
import { UserRepository } from '../../../user/user.repository';
import { PostRepository } from '../../post.repository';

export class LikePostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public inputModel: LikeDto,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostCase implements ICommandHandler<LikePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: LikePostCommand) {
    const post = await this.postRepository.findPostById(command.postId);

    if (!post) {
      return { s: 404 };
    }

    let myStatusBefore = '';
    const like = post.extendedLikesInfo.find(
      (m) => m.userId === command.userId,
    );
    if (like) {
      myStatusBefore = like.status;
    }

    if (myStatusBefore === command.inputModel.likeStatus) {
      return true;
    }

    const user = await this.userRepository.findUserById(command.userId);

    if (!user) {
      return { s: 404 };
    }
    const index = post.extendedLikesInfo.findIndex(
      (m) => m.userId === command.userId,
    );

    if (
      command.inputModel.likeStatus === 'None' &&
      post.extendedLikesInfo.length > 0
    ) {
      if (index > -1) {
        post.extendedLikesInfo.splice(index, 1);
      }
    } else if (
      command.inputModel.likeStatus === 'Like' ||
      command.inputModel.likeStatus === 'Dislike'
    ) {
      if (index > -1) {
        post.extendedLikesInfo[index].status = command.inputModel.likeStatus;
        post.extendedLikesInfo[index].addedAt = new Date().toISOString();
      } else {
        post.extendedLikesInfo.push({
          addedAt: new Date().toISOString(),
          userId: command.userId,
          login: user.login,
          status: command.inputModel.likeStatus,
        });
      }
    }

    try {
      await this.postRepository.save(post);
      return true;
    } catch (error) {
      return { s: 500 };
    }
  }
}
