import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

// Mock del repositorio de usuarios
const mockRepository = {
  findOneBy: jest.fn(),
};

xdescribe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  xdescribe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com', username: 'Test User' } as User;
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getUserByEmail('nonexistent@example.com')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    });
  });
});
