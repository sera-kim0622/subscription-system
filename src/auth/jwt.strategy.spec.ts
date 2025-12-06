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
  beforeEach(() => {
    jest.resetModules();
  });

  it('JWT_SECRET이 있을 때 해당 secret을 사용한다.', () => {
    process.env.JWT_SECRET = 'test-secret';
    const strategy = new JwtStrategy();
    expect(strategy).toBeDefined();
  });

  it('JWT_SECRET이 없을 때 dev-secret을 사용한다.', () => {
    delete process.env.JWT_SECRET;
    const strategy = new JwtStrategy();
    expect(strategy).toBeDefined();
  });

  it('validate가 payload를 그대로 반환한다.', async () => {
    const strategy = new JwtStrategy();
    const payload = {
      sub: '1',
      email: 'sera@gmail.com',
      role: UserRole.ADMIN,
    };

    const result = await strategy.validate(payload);
    expect(result).toEqual({
      userId: 1,
      email: 'sera@gmail.com',
      role: UserRole.ADMIN,
    });
  });
});
