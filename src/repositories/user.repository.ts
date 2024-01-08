import { CreateUserDto } from "../interfaces";
import { User } from "../models";
import { BadRequestError, ENTITY_SHOULD_BE_UBNIQUE } from "../utils";

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
}

export default new UserRepository();
