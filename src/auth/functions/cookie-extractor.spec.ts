import { cookieExtractor } from './cookie-extractor';

describe('cookieExtractor 순수 함수 테스트', () => {
  it('req와 req.cookies가 존재할 때 accessToken을 반환', () => {
    const req = {
      cookies: { accessToken: 'accessToken test' },
    } as any;

    const result = cookieExtractor(req);

    expect(result).toBe('accessToken test');
  });

  it('req와 req.cookies가 존재하지만 null을 반환', () => {
    const req = {
      cookies: {},
    } as any;

    const result = cookieExtractor(req);

    expect(result).toBe(null);
  });

  it('req가 없으면 null을 반환', () => {
    const req = null;

    const result = cookieExtractor(req);

    expect(result).toBe(null);
  });
});
