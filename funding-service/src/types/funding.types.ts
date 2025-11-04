export type FundingProvider = "PLAID" | "STRIPE";

export type FundingPaymentMethod =
  | "BANK_TRANSFER"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "APPLE_PAY"
  | "GOOGLE_PAY";

export type Currency = "CAD";

export type FundingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface Transaction {
  id: string;
  sessionId: string;
  transactionId: string;
  userId: string;
  provider: FundingProvider;
  method: FundingPaymentMethod;
  amountCents: number;
  currency: Currency;
  status: FundingStatus;
  providerTransactionId?: string;
  feeCents: number;
  metadata: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
  walletTransactionId?: string;
  paymentMethodId?: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  provider: FundingProvider;
  type: FundingPaymentMethod;
  providerMethodId?: string;
  lastFour?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  metadata: Record<string, unknown>;
  createdAt: number;
  bankDetails?: {
    accountId: string;
    mask: string;
    name: string;
    type: string;
    subtype: string;
    routingNumber?: string;
  };
}

export interface InitiateFundingInput {
  provider: FundingProvider;
  method: FundingPaymentMethod;
  amountCents: number;
  currency: Currency;
  paymentMethodId?: string;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitiateFundingResponse {
  sessionId: string;
  provider: FundingProvider;
  redirectUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ProcessFundingInput {
  sessionId: string;
  paymentToken: string;
  providerSpecificData?: Record<string, unknown>;
}

export interface ProcessFundingResponse {
  transactionId: string;
  status: FundingStatus;
  provider: FundingProvider;
  method: FundingPaymentMethod;
  amountCents: number;
  currency: Currency;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

export interface FundingStatusResponse {
  transactionId: string;
  status: FundingStatus;
  provider: FundingProvider;
  method: FundingPaymentMethod;
  amountCents: number;
  currency: Currency;
  updatedAt: number;
}
