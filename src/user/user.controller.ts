import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('by-email')
  async getUserByEmail(@Query('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
