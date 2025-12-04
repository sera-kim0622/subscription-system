export enum PeriodType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface CreateSubscriptionInput {
  userId: number;
  productId: number;
  period: PeriodType;
  paymentId: number;
}
