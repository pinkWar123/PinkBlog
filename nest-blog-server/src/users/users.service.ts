import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UserRegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];
  async create(userRegisterDto: UserRegisterDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOne(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async hasUsernameExisted(username: string) {
    const user = await this.userModel.findOne({ username });
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
    try {
      const res = await this.userModel.create({
        ...userRegisterDto,
        password: this.getHashPassword(userRegisterDto.password),
      });
      return res;
    } catch (error) {
      throw new BadRequestException('Ahihie');
    }
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
}
