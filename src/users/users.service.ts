import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel:Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();

    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    const user =  await this.userModel.findById(id).exec();
    if(user) return user;
    return new HttpException("User Not found.", 404);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if(!user) return new HttpException("User Not found.", 404);
    return this.userModel.findByIdAndDelete(id);
  }
}
