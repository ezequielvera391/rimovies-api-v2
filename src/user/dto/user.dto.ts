import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email address for the account',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'password123',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}

export class GetUserByEmailDto {
  @ApiProperty({
    description: 'Email address to search for',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;
}
