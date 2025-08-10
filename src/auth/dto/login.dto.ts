import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email address for login',
    example: 'john_doe or john@example.com',
    minLength: 5,
    maxLength: 15,
  })
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString({ message: 'Username or email must be a string' })
  @ValidateIf((o: LoginDto) => o.identifier.includes('@'))
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @ValidateIf((o) => !o.identifier.includes('@'))
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  @MaxLength(15, { message: 'Username cannot exceed 15 characters' })
  identifier: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
