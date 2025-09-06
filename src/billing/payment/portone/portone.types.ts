/**
 * PortOne 결제 응답 (모킹용 최소 스키마)
 */

export type PortOnePaymentStatus = 'PAID' | 'FAILED';

export interface PortOneResult {
  /** 결제 트랜잭션 ID(고유 값으로 UUID) */
  txId: string;

  /** 결제 상태 */
  status: PortOnePaymentStatus;

  /** 결제 완료 시각 (성공한 경우만, ISO string) */
  paidAt?: string;

  /** 실패 사유 (실패한 경우만) */
  failReason?: string;
}
