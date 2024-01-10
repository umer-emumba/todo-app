import { CreateUserDto, ISocialLogin } from "../interfaces";
import { User } from "../models";
import {
  ACCOUNT_ALREAD_EXIST_WITH_THIS_EMAIL,
  BadRequestError,
  ENTITY_SHOULD_BE_UBNIQUE,
} from "../utils";

class UserRepository {
  async create(dto: CreateUserDto): Promise<User> {
    const isEmailUnique = await User.count({
      where: {
        email: dto.email,
      },
    });

    if (isEmailUnique > 0) {
      throw new BadRequestError(ENTITY_SHOULD_BE_UBNIQUE("Email"));
    }

    const user = await User.create({
      ...dto,
    });
    return user;
  }

  async markUserVerified(id: number): Promise<void> {
    await User.update(
      {
        email_verified_at: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async findByEmailUnscoped(email: string): Promise<User | null> {
    return User.unscoped().findOne({
      where: {
        email: email,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return User.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: Partial<User>): Promise<[number]> {
    return await User.update(
      {
        ...data,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async socialLogin(dto: ISocialLogin): Promise<User> {
    const checkUserExist = await User.unscoped().findOne({
      where: {
        social_media_token: dto.social_media_token,
      },
    });
    //Check if there is any user exist with provided social media token
    if (checkUserExist) {
      return checkUserExist;
    } else {
      //if no user exist we will create a new account. if email is provided then we will check email unqiness
      if (dto.email) {
        const isEmailUnique = await User.count({
          where: {
            email: dto.email,
          },
        });

        if (isEmailUnique > 0) {
          throw new BadRequestError(ACCOUNT_ALREAD_EXIST_WITH_THIS_EMAIL);
        }
      }

      const user = await User.create({
        ...dto,
        email_verified_at: new Date(),
      });
      return user;
    }
  }
}

export default new UserRepository();
