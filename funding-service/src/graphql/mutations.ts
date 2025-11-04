import { gql } from "@apollo/client";

export const INITIATE_FUNDING = gql`
  mutation InitiateFunding($input: InitiateFundingInput!) {
    initiateFunding(input: $input) {
      success
      sessionId
      clientSecret
      redirectUrl
      linkToken
      expiresAt
      providerData
      error {
        code
        message
      }
    }
  }
`;

export const PROCESS_FUNDING = gql`
  mutation ProcessFunding($input: ProcessFundingInput!) {
    processFunding(input: $input) {
      success
      transactionId
      status
      message
      processedAmountCents
      feeCents
      walletTransactionId
      error {
        code
        message
      }
    }
  }
`;

export const CANCEL_FUNDING = gql`
  mutation CancelFunding($input: CancelFundingInput!) {
    cancelFunding(input: $input) {
      success
      message
      refundId
      error {
        code
        message
      }
    }
  }
`;

export const VERIFY_BANK_ACCOUNT = gql`
  mutation VerifyBankAccount($input: VerifyBankAccountInput!) {
    verifyBankAccount(input: $input) {
      success
      verified
      message
      paymentMethodId
      bankDetails {
        accountId
        mask
        name
        type
        subtype
        routingNumber
      }
      error {
        code
        message
      }
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($input: AddPaymentMethodInput!) {
    addPaymentMethod(input: $input) {
      success
      paymentMethodId
      paymentMethod {
        id
        userId
        provider
        type
        lastFour
        brand
        isDefault
        isActive
        createdAt
      }
      error {
        code
        message
      }
    }
  }
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemovePaymentMethod($input: RemovePaymentMethodInput!) {
    removePaymentMethod(input: $input) {
      success
      message
      error {
        code
        message
      }
    }
  }
`;

export const SET_DEFAULT_PAYMENT_METHOD = gql`
  mutation SetDefaultPaymentMethod($input: SetDefaultPaymentMethodInput!) {
    setDefaultPaymentMethod(input: $input) {
      success
      message
      error {
        code
        message
      }
    }
  }
`;

export const REFUND_TRANSACTION = gql`
  mutation RefundTransaction($input: RefundTransactionInput!) {
    refundTransaction(input: $input) {
      success
      refundId
      refundedAmountCents
      newStatus
      error {
        code
        message
      }
    }
  }
`;
