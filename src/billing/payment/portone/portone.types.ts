/**
 * PortOne 결제 응답 스키마 (우리 서비스 표준형)
 * - 외부(PortOne) 필드를 그대로 노출하지 않고, 최소 공통 스키마로 캡슐화
 * - raw 필드에 원문 응답을 보관해 디버깅/감사를 돕는다.
 */

export type PaymentCurrency = 'KRW' | 'USD' | string;
export type PaymentMethod =
  | 'CARD'
  | 'VIRTUAL_ACCOUNT'
  | 'BANK_TRANSFER'
  | 'MOBILE'
  | 'EASY_PAY'
  | string;

export type PortOnePaymentStatus = 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING';

export interface PortOneResultBase {
  /** 벤더 식별자 (고정) */
  provider: 'PORTONE';
  /** 우리 서비스 표준 결제 상태 */
  status: PortOnePaymentStatus;
  /** 원 요청(주문) 식별자 - 우리 서비스에서 생성한 orderId */
  orderId?: string;
  /** 외부 원문 응답: 감사/디버깅용 */
  raw?: unknown;
}

/** ====== 결제 성공 ====== */
export interface PortOneSuccessResult extends PortOneResultBase {
  status: 'PAID';

  /** PortOne 트랜잭션(요청) ID (예: txId) */
  txId: string;

  /** PG사 거래 ID (예: pgTxId) */
  pgTxId: string;

  /** PortOne 고객 식별자 (billing key의 주인) */
  customerId?: string;

  /** 결제 승인 시각 (RFC3339) */
  paidAt: string;

  /** 결제 요청 시각 (RFC3339) */
  requestedAt?: string;

  /** 금액/통화 */
  amount: number;
  currency: PaymentCurrency;

  /** 결제 수단 요약 */
  paymentMethod: PaymentMethod;

  /** 카드 결제 부가정보(카드사/승인번호/할부 등) */
  card?: {
    issuer?: string;          // 카드사 이름 또는 코드
    numberMasked?: string;    // 마스킹된 카드번호
    installment?: number;     // 할부개월(0: 일시불)
    approvalNo?: string;      // 승인번호
    cardType?: string;        // 신용/체크 등
  };

  /** 영수증/전표 URL */
  receiptUrl?: string;

  /** 기타 메타데이터 (포트원 metadata -> stringified or normalized) */
  metadata?: Record<string, any>;
}

/** ====== 결제 실패 ====== */
export interface PortOneFailResult extends PortOneResultBase {
  status: 'FAILED';

  /** 포트원/PG 에러 코드 & 메시지 */
  code: string;
  message: string;

  /** 실패 시각 (RFC3339) */
  occurredAt?: string;

  /** 사용된 billingKey / customerId 등 */
  customerId?: string;
}

/** ====== 결제 취소(전액/부분) ====== */
export interface PortOneCancelledResult extends PortOneResultBase {
  status: 'CANCELLED';

  /** 원 결제 PG 거래 ID (취소가 참조하는 결제) */
  pgTxId?: string;

  /** 취소 트랜잭션 ID (있다면) */
  pgCancelTxId?: string;

  /** 취소 금액 */
  cancelAmount: number;

  /** 취소 시각 (RFC3339) */
  cancelAt: string;

  /** 취소 사유 */
  reason?: string;
}

/** ====== 결제 진행 중 (웹훅 대기 등) ====== */
export interface PortOnePendingResult extends PortOneResultBase {
  status: 'PENDING';
  txId?: string;
  requestedAt?: string;
}

/** 표준 유니온 타입 */
export type PortOneResult =
  | PortOneSuccessResult
  | PortOneFailResult
  | PortOneCancelledResult
  | PortOnePendingResult;

/* ------------------------------------------------------------------ */
/* 아래는 레거시/참고: 외부 스키마 일부를 유지하고 싶을 때 (필요 시만 사용) */
/* ------------------------------------------------------------------ */

/** (참고) 레거시: PortOne BillingKey Pay 응답 요약 (GraphQL에서 쓰이던 예시) */
export interface PORTONE_BILLINGKEY_PAY_RESPONSE_LEGACY {
  tx_id: string;
  customer_id: string;
  requested_at: string;
  paid_at: string;
  pg_tx_id: string; // PG사 거래 ID
}

/** (참고) 포트원 BillingKey 결제 완료 요약 V2 */
export type PORTONE_BILLINGKEY_PAYMENT_SUMMARY_V2 = {
  pgTxId: string;  // PG사 결제 아이디
  paidAt: string;  // RFC3339
};
