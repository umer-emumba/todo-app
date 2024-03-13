import { Sequelize } from "sequelize-typescript";
import { CreateUserDto, ISocialLogin, UserSettingDto } from "../interfaces";
import { User, UserSetting } from "../models";
import sequelize from "../models/connection";
import {
  ACCOUNT_ALREAD_EXIST_WITH_THIS_EMAIL,
  BadRequestError,
  ENTITY_SHOULD_BE_UBNIQUE,
} from "../utils";
import { BaseRepository } from "./base.repository";

class UserRepository extends BaseRepository<User> {
  constructor(sequelize: Sequelize) {
    super(sequelize, User);
  }

  async countByEmail(email: string): Promise<number> {
    return await User.count({
      where: {
        email,
      },
    });
  }

  async findByEmailUnscoped(email: string): Promise<User | null> {
    return User.unscoped().findOne({
      where: {
        email: email,
      },
    });
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

  async getUserSetting(userId: number): Promise<UserSetting | null> {
    return UserSetting.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async updateUserSetting(userId: number, dto: UserSettingDto): Promise<void> {
    await UserSetting.update(
      {
        ...dto,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
  }
}

export default new UserRepository(sequelize);
