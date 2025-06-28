import { UserRole } from '../../common/enums/user-role.enum';

// User entity interface
export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// User creation interface
export interface ICreateUser {
  username: string;
  email: string;
  password: string;
}

// User update interface
export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

// User service interfaces
export interface IUserService {
  getUserByEmail(email: string): Promise<IUser>;
  getUserById(id: number): Promise<IUser>;
  createUser(createUserDto: ICreateUser): Promise<IUser>;
}
