import { gql } from "@apollo/client";

export const GET_FUNDING_STATUS = gql`
  query GetFundingStatus($input: GetFundingStatusInput!) {
    getFundingStatus(input: $input) {
      success
      transaction {
        id
        sessionId
        transactionId
        userId
        provider
        method
        amountCents
        currency
        status
        providerTransactionId
        feeCents
        metadata
        createdAt
        updatedAt
        walletTransactionId
        paymentMethodId
      }
      error {
        code
        message
      }
    }
  }
`;

export const GET_TRANSACTION_HISTORY = gql`
  query GetTransactionHistory($input: GetTransactionHistoryInput!) {
    getTransactionHistory(input: $input) {
      success
      transactions {
        id
        sessionId
        transactionId
        userId
        provider
        method
        amountCents
        currency
        status
        providerTransactionId
        feeCents
        metadata
        createdAt
        updatedAt
        walletTransactionId
        paymentMethodId
      }
      totalCount
      error {
        code
        message
      }
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods($input: GetPaymentMethodsInput!) {
    getPaymentMethods(input: $input) {
      success
      paymentMethods {
        id
        userId
        provider
        type
        providerMethodId
        lastFour
        brand
        expiryMonth
        expiryYear
        isDefault
        isActive
        metadata
        createdAt
        bankDetails {
          accountId
          mask
          name
          type
          subtype
          routingNumber
        }
      }
      error {
        code
        message
      }
    }
  }
`;
