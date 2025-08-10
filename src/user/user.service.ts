import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { hashPassword } from './utils/password.utils';
import { IUser, IUserService } from './interfaces/user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async getUserByIdentifier(identifier: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      throw new NotFoundException(`User with username or email ${identifier} not found`);
    }

    return user;
  }

  async getUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, username, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('User with the provided credentials already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }
}
