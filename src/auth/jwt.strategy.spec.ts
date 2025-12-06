import { UserRole } from '../user/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';

jest.mock('passport-jwt', () => {
  const actual = jest.requireActual('passport-jwt');
  return {
    ...actual,
    Strategy: jest.fn().mockImplementation(function (options, verify) {
      this.name = 'jwt';
      this._verify = verify;
    }),
    ExtractJwt: {
      fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue('Bearer token'),
    },
  };
});

describe('jwt를 추출해 payload를 전달하는 가드', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret';
    jwtStrategy = new JwtStrategy();
  });

  it('validate가 payload를 그대로 반환한다.', async () => {
    const payload = {
      sub: '1',
      email: 'sera@gmail.com',
      role: UserRole.ADMIN,
    };

    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({
      userId: 1,
      email: 'sera@gmail.com',
      role: UserRole.ADMIN,
    });
  });
});
