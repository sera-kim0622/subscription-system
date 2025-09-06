export type PeriodType = 'MONTHLY' | 'YEARLY';

export interface CreateSubscriptionInput {
  userId: number;
  productId: number;
  period: PeriodType;
  txId: string;
  paidAt: string;
}
