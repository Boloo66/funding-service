import axios from "axios";
import {
  type InitiateFundingInput,
  type InitiateFundingResponse,
  type ProcessFundingInput,
  type ProcessFundingResponse,
  type FundingStatusResponse,
} from "../types/funding.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fundingService = {
  async initiateFunding(
    request: InitiateFundingInput
  ): Promise<InitiateFundingResponse> {
    const response = await apiClient.post("/graphql", {
      query: `
        mutation InitiateFunding($input: InitiateFundingInput!) {
          initiateFunding(input: $input) {
            success
            sessionId
            linkToken
            expiresAt
            error
          }
        }
      `,
      variables: {
        input: request,
      },
    });

    return response.data.data.initiateFunding;
  },

  async processFunding(
    request: ProcessFundingInput
  ): Promise<ProcessFundingResponse> {
    const response = await apiClient.post("/graphql", {
      query: `
        mutation ProcessFunding($input: ProcessFundingInput!) {
          processFunding(input: $input) {
            success
            transactionId
            status
            message
            processedAmountCents
            feeCents
            error
          }
        }
      `,
      variables: {
        input: request,
      },
    });

    return response.data.data.processFunding;
  },

  async getFundingStatus(
    transactionId: string
  ): Promise<FundingStatusResponse> {
    const response = await apiClient.post("/graphql", {
      query: `
        query GetFundingStatus($input: GetFundingStatusInput!) {
          getFundingStatus(input: $input) {
            success
            transaction {
              id
              transactionId
              status
              amountCents
              currency
              createdAt
            }
            error
          }
        }
      `,
      variables: {
        input: { transactionId },
      },
    });

    return response.data.data.getFundingStatus;
  },
};
