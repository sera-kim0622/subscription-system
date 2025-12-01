import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

describe('회원가입', () => {
  let service: UserService;
  let userRepository;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('이미 존재하는 이메일이면 에러를 반환한다.', async () => {
    userRepository.findOne.mockResolvedValue({ id: 1 });
    await expect(
      service.create({ email: 'sera.kim@gmail.com', password: 'pass1234' }),
    ).rejects.toThrow(ConflictException);
  });

  it('회원가입 도중 에러가 발생하면 알 수 없는 에러 반환.', () => {});
  it('회원가입 성공 시 가입한 유저의 정보를 반환한다.', () => {});
});
