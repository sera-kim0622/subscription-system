import { instanceToPlain } from 'class-transformer';
import { TransformDate } from './date.format';

class TestDateDto {
  @TransformDate('date')
  testDate: Date;
}

class TestDateTimeDto {
  @TransformDate('datetime')
  testDate: Date;
}

describe('Date객체를 yyyy-MM-dd로 시작하는 string으로 반환하는 함수 테스트', () => {
  it('format을 date로 선택하면 yyyy-MM-dd형식으로 반환', () => {
    const dto = new TestDateDto();

    dto.testDate = new Date('2026-02-10T00:00:00Z');

    const plain = instanceToPlain(dto);

    expect(plain.testDate).toBe('2026-02-10');
    expect(typeof plain.testDate).toBe('string');
  });

  it('format을 datetime으로 선택하면 yyyy-MM-dd HH:mm:ss으로 반환한다.', () => {
    const dto = new TestDateTimeDto();

    dto.testDate = new Date('2026-02-10T00:00:00Z');

    const plain = instanceToPlain(dto);

    expect(plain.testDate).toBe('2026-02-10 00:00:00');
    expect(typeof plain.testDate).toBe('string');
  });

  it('값이 들어오지 않았을 경우 null을 반환한다..', () => {
    const dto = new TestDateTimeDto();

    dto.testDate = null;

    const plain = instanceToPlain(dto);

    expect(plain.testDate).toBe(null);
  });
});
