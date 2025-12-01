import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

let service: UserService;
let userRepository;
let jwtService: DeepMockProxy<JwtService>;

beforeEach(async () => {
  userRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getRepositoryToken(User),
        useValue: userRepository,
      },
      {
        provide: JwtService,
        useValue: mockDeep<JwtService>(),
      },
    ],
  }).compile();

  service = module.get<UserService>(UserService);
  jwtService = module.get(JwtService);
});

describe('회원가입', () => {
  it('이미 존재하는 이메일이면 에러를 반환한다.', async () => {
    userRepository.findOne.mockResolvedValue({ id: 1 });
    await expect(
      service.create({ email: 'sera.kim@gmail.com', password: 'pass1234' }),
    ).rejects.toThrow(ConflictException);
  });

  it('회원가입 도중 에러가 발생하면 알 수 없는 에러 반환.', async () => {
    const error = new Error('회원가입 도중 알 수 없는 에러가 발생하였습니다.');
    userRepository.findOne.mockRejectedValue(error);
    await expect(
      service.create({ email: 'sera.kim@gmail.com', password: 'pass1234' }),
    ).rejects.toThrow(error);
  });

  it('회원가입 성공 시 가입한 유저의 정보를 반환한다.', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    userRepository.create.mockReturnValue({ email: 'sera.kim@gmail.com' });
    userRepository.save.mockResolvedValue({
      id: 1,
      email: 'sera.kim@gmail.com',
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    const hash = await bcrypt.hash('pass1234', 12);
    const result = await service.create({
      email: 'sera.kim@gmail.com',
      password: 'pass1234',
    });
    expect(result).toEqual({ id: 1, email: 'sera.kim@gmail.com' });
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'sera.kim@gmail.com',
      password: hash,
    });
  });
});

describe('가입한 회원(로그인)인지 확인하는 함수', () => {
  it('존재하지 않는 회원일 경우 UnauthorizedException을 반환', async () => {
    userRepository.findOne.mockResolvedValue(undefined);
    await expect(
      service.validateUser({
        email: 'sera.kim@gmail.com',
        password: 'pass1234',
      }),
    ).rejects.toThrow(UnauthorizedException);

    userRepository.findOne.mockResolvedValue(undefined);
    await expect(
      service.validateUser({
        email: 'sera.kim@gmail.com',
        password: 'pass1234',
      }),
    ).rejects.toThrow('존재하지 않는 이메일입니다');
  });

  it('비밀번호가 일치하지 않는 경우 UnauthorizedException을 반환', async () => {
    userRepository.findOne.mockResolvedValue({ id: 1 });
    const compareError = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = compareError;

    await expect(
      service.validateUser({
        email: 'sera.kim@gmail.com',
        password: 'pass1234',
      }),
    ).rejects.toThrow(
      new UnauthorizedException('비밀번호가 일치하지 않습니다.'),
    );
  });

  it('로그인 중 알 수 없는 에러가 발생했을 때 에러 반환', async () => {
    userRepository.findOne.mockResolvedValue({ id: 1 });
    // 비밀번호 일치시키는 로직
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // jwt발급 중 에러 발생
    jwtService.signAsync.mockRejectedValue(new Error('jwt error'));
    await expect(
      service.validateUser({
        email: 'sera.kim@gmail.com',
        password: 'pass1234',
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('로그인에 성공하여 accessToken을 반환', async () => {});
});
