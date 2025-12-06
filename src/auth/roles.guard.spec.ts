import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('관리자 유저 나누는 가드', () => {
  let guard: RolesGuard;
  const reflector = { get: jest.fn } as unknown as Reflector;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflector);
  });

  const createContext = (user: any) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: jest.fn,
    }) as any;

  it('메타데이터에 설정된 role이 없으면 true를 반환', () => {
    reflector.get = jest.fn().mockReturnValue(undefined);
    const mockContext = createContext({ id: 1 });
    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('메타데이터에 설정된 role이 있으면 request.user.role의 값이 세팅한 role에 포함되면 true 반환', () => {
    reflector.get = jest.fn().mockReturnValue(['ADMIN']);
    const mockContext = createContext({ role: 'ADMIN' });
    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('메타데이터에 설정된 role이 있으면 request.user.role의 값이 세팅한 role에 포함되지 않으면 false 반환', () => {
    reflector.get = jest.fn().mockReturnValue(['ADMIN']);
    const mockContext = createContext({ role: 'USER' });
    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
