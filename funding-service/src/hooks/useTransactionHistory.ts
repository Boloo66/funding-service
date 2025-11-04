import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTION_HISTORY } from "../graphql/queries";
import type { FundingStatus, Transaction } from "../types/funding.types";

interface UseTransactionHistoryOptions {
  limit?: number;
  offset?: number;
  status?: FundingStatus;
  fromDate?: number;
  toDate?: number;
}

interface GetTransactionHistoryResponse {
  getTransactionHistory: {
    success: boolean;
    transactions: Transaction[];
    totalCount: number;
    error?: {
      message: string;
      code: string;
    };
  };
}

export function useTransactionHistory(
  options: UseTransactionHistoryOptions = {}
) {
  const { limit = 50, offset = 0, status, fromDate, toDate } = options;

  const { data, loading, error, refetch } =
    useQuery<GetTransactionHistoryResponse>(GET_TRANSACTION_HISTORY, {
      variables: {
        input: {
          limit,
          offset,
          ...(status && { status }),
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
        },
      },
    });

  return {
    transactions: data?.getTransactionHistory?.transactions || [],
    totalCount: data?.getTransactionHistory?.totalCount || 0,
    loading,
    error,
    refetch,
  };
}
