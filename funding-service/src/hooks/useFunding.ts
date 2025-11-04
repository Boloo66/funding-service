import { useMutation } from "@apollo/client/react";
import {
  INITIATE_FUNDING,
  PROCESS_FUNDING,
  CANCEL_FUNDING,
} from "../graphql/mutations";
import type {
  InitiateFundingInput,
  ProcessFundingInput,
} from "../types/funding.types";

export interface InitiateFundingResponse {
  initiateFunding: {
    success: boolean;
    sessionId?: string;
    clientSecret?: string;
    linkToken?: string;
    expiresAt?: number;
    error?: {
      message: string;
      code: string;
    };
  };
}

interface ProcessFundingResponse {
  processFunding: {
    success: boolean;
    transactionId?: string;
    status?: string;
    message?: string;
    error?: {
      message: string;
      code: string;
    };
  };
}

interface CancelFundingResponse {
  cancelFunding: {
    success: boolean;
    message?: string;
    error?: {
      message: string;
      code: string;
    };
  };
}

export function useFunding() {
  const [initiateFundingMutation, { loading: initiating }] =
    useMutation<InitiateFundingResponse>(INITIATE_FUNDING);
  const [processFundingMutation, { loading: processing }] =
    useMutation<ProcessFundingResponse>(PROCESS_FUNDING);
  const [cancelFundingMutation, { loading: cancelling }] =
    useMutation<CancelFundingResponse>(CANCEL_FUNDING);

  const initiateFunding = async (input: InitiateFundingInput) => {
    try {
      const { data } = await initiateFundingMutation({
        variables: { input },
      });

      if (!data?.initiateFunding?.success) {
        throw new Error(
          data?.initiateFunding?.error?.message || "Failed to initiate funding"
        );
      }

      return data.initiateFunding;
    } catch (error) {
      console.error("Initiate funding error:", error);
      throw error;
    }
  };

  const processFunding = async (input: ProcessFundingInput) => {
    try {
      const { data } = await processFundingMutation({
        variables: { input },
      });

      if (!data?.processFunding?.success) {
        throw new Error(
          data?.processFunding?.error?.message || "Failed to process funding"
        );
      }

      return data.processFunding;
    } catch (error) {
      console.error("Process funding error:", error);
      throw error;
    }
  };

  const cancelFunding = async (transactionId: string, reason: string) => {
    try {
      const { data } = await cancelFundingMutation({
        variables: {
          input: { transactionId, reason },
        },
      });

      if (!data?.cancelFunding?.success) {
        throw new Error(
          data?.cancelFunding?.error?.message || "Failed to cancel funding"
        );
      }

      return data.cancelFunding;
    } catch (error) {
      console.error("Cancel funding error:", error);
      throw error;
    }
  };

  return {
    initiateFunding,
    processFunding,
    cancelFunding,
    loading: initiating || processing || cancelling,
  };
}
