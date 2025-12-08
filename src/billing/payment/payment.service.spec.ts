import { SubscriptionService } from '../subscription/subscription.service';
import { PaymentService } from './payment.service';

let paymentService: PaymentService;
let productRepository;
let subscriptionService: SubscriptionService;

beforeEach(async () => {
  productRepository = {};
});
describe('결제 함수 테스트', () => {
  it('결제하려는 상품이 존재하지 않을 경우 에러를 반환', () => {});

  it('결제하려는 유저가 존재하지 않을 경우 에러를 반환', () => {});

  it('이미 구독중인 상품이 있는 경우 에러를 반환', () => {});

  it('결제 결과를 받은 후 결제 테이블에 저장하다가 실패', () => {});

  it('결제 성공 후 구독권을 생성하다가 실패 => 구독권 발급 3회 시도 중 성공', () => {});

  it('결제 성공 후 구독권을 생성하다가 실패 => 구독권 발급 3회 시도 모두 실패', () => {});

  it('결제 성공 후 구독권을 생성하여 결제, 구독정보 반환', () => {});

  it('결제 실패하여 결제 정보를 반환', () => {});
});
