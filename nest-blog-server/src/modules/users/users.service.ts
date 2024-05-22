import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UserRegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { IUser } from 'src/types/user.type';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { Role, RoleDocument } from '@modules/roles/schemas/role.schema';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  async create(userRegisterDto: UserRegisterDto) {
    let role = userRegisterDto.role;
    if (role) {
      const targetRole = await this.roleModel.findById(role);
      if (!targetRole) {
        throw new BadRequestException(`Role ${role} not found`);
      }
    } else {
      const userRole = (
        await this.roleModel.findOne({ name: 'USER' })
      ).toObject();
      if (userRole) role = userRole._id.toString();
    }
    const res = await this.userModel.create({ ...userRegisterDto, role });
    const actualRole = (await this.roleModel.findById(role)).toObject();
    const result = {
      ...res,
      role: {
        _id: actualRole._id.toString(),
        name: actualRole.name,
      },
    };
    console.log(result);
    return result;
  }

  async findUsersWithPagination(current: number, pageSize: number, qs: string) {
    try {
      const { population, projection, filter } = aqp(qs);
      const { sort }: { sort: any } = aqp(qs);
      delete filter.pageSize;
      delete filter.current;
      const totalItems = await this.userModel.countDocuments({ ...filter });
      const totalPages = Math.ceil(totalItems / pageSize);
      const calculatedSkip = (current - 1) * pageSize;

      const users = await this.userModel
        .find({ ...filter })
        .sort({ ...sort })
        .skip(calculatedSkip > 0 ? calculatedSkip : 0)
        .limit(pageSize)
        .select({ ...projection, password: 0, refreshToken: 0 })
        .lean()
        .exec();

      const rolePromises = users.map(async (user) => {
        const role = this.roleModel.findById(user.role);
        return role;
      });
      const roles = await Promise.all(rolePromises);

      return {
        meta: {
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: users.map((user, index) => {
          const role = roles[index]?.toObject();
          return {
            ...user,
            _id: user?._id.toString(),
            role: { ...role, _id: role?._id.toString() },
          };
        }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const res = await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: user._id,
      },
    );
    return res;
  }

  async removeUserById(id: string, user: IUser) {
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );
    const res = await this.userModel.softDelete({ _id: id });
    return res;
  }

  async findOne(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async findOneById(id: string, currentUser: string) {
    const user = (await this.userModel.findById(id)).toObject();
    delete user.password;
    delete user.refreshToken;
    let hasFollowedUser = false;
    if (currentUser)
      hasFollowedUser = user.followedBy.some((item) => item == currentUser);
    const numOfFollowers = user.followedBy?.length ?? 0;
    delete user.followedBy;
    const role = await this.roleModel.findById(user.role);
    role._id = role.id.toString();
    return {
      ...user,
      _id: user._id.toString(),
      role: {
        ...role.toObject(),
        _id: user.role.toString(),
      },
      isFollowed: hasFollowedUser,
      numOfFollowers: numOfFollowers,
    };
  }

  async hasUsernameExisted(username: string) {
    const user = await this.userModel.findOne({ username });
    console.log(user);
    if (user !== null) {
      return user.username;
    }
    return null;
  }

  async register(userRegisterDto: UserRegisterDto) {
    const username = userRegisterDto.username;
    const hasUsernameExisted = await this.hasUsernameExisted(username);
    if (hasUsernameExisted !== null)
      throw new BadRequestException('Username has already existed');

    const res = await this.userModel.create({
      ...userRegisterDto,
      password: this.getHashPassword(userRegisterDto.password),
    });
    return res;
  }

  async updateUserRefreshToken(_id: string, refreshToken: string) {
    try {
      const user = await this.userModel.findById(_id);
      if (user) {
        const res = await this.userModel.updateOne(
          { _id },
          {
            refreshToken: refreshToken,
          },
        );
        return res;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async handleFollowUserById(targetId: string, followDto: { _id: string }) {
    try {
      const targetUser = (await this.userModel.findById(targetId)).toObject();
      if (!targetUser) {
        throw new Error('Target user does not exists');
      }

      const hasFollowedUser = targetUser.followedBy.some(
        (item) => item == followDto._id,
      );
      console.log(hasFollowedUser);
      if (hasFollowedUser) {
        await this.userModel.updateOne(
          { _id: targetId },
          {
            $pull: {
              followedBy: followDto._id,
            },
          },
        );
      } else {
        const res = await this.userModel.updateOne(
          { _id: targetId },
          {
            $push: { followedBy: followDto._id },
          },
        );
        console.log(res);
      }
      return {
        isFollowed: !hasFollowedUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findFollowersOfUserById(id: string, current: number, pageSize: number) {
    if (current < 0 || pageSize < 0)
      throw new BadRequestException('Invalid current or pageSize');
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      const totalItems = user.followedBy.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const calculatedSkip = (current - 1) * pageSize;
      const followers = [];
      if (calculatedSkip <= totalItems) {
        const idsList = user.followedBy.slice(
          calculatedSkip,
          calculatedSkip + pageSize < totalItems
            ? calculatedSkip + pageSize - 1
            : totalItems,
        );
        if (idsList.length > 0) {
          const promises = idsList.map(async (followedId) => {
            const follower = await this.userModel.findById(followedId);
            if (user) {
              followers.push({
                _id: followedId,
                username: follower.username,
                numOfPosts: follower.numOfPosts ?? 0,
                numOfFollowers: follower.followedBy.length,
                reputation: follower.reputation ?? 0,
                profileImageUrl: follower.profileImageUrl,
              });
            }
          });
          await Promise.all(promises);
        }
      }

      return {
        meta: {
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: followers,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
