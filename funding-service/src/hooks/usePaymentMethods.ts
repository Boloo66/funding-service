import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PAYMENT_METHODS } from "../graphql/queries";
import {
  ADD_PAYMENT_METHOD,
  REMOVE_PAYMENT_METHOD,
  SET_DEFAULT_PAYMENT_METHOD,
} from "../graphql/mutations";
import type {
  FundingProvider,
  FundingPaymentMethod,
  PaymentMethod,
} from "../types/funding.types";

// Define response types
interface GetPaymentMethodsResponse {
  getPaymentMethods: {
    success: boolean;
    paymentMethods: PaymentMethod[];
    error?: {
      message: string;
      code: string;
    };
  };
}

interface AddPaymentMethodResponse {
  addPaymentMethod: {
    success: boolean;
    paymentMethodId?: string;
    paymentMethod?: PaymentMethod;
    error?: {
      message: string;
      code: string;
    };
  };
}

interface RemovePaymentMethodResponse {
  removePaymentMethod: {
    success: boolean;
    message?: string;
    error?: {
      message: string;
      code: string;
    };
  };
}

interface SetDefaultPaymentMethodResponse {
  setDefaultPaymentMethod: {
    success: boolean;
    message?: string;
    error?: {
      message: string;
      code: string;
    };
  };
}

export function usePaymentMethods() {
  const { data, loading, error, refetch } = useQuery<GetPaymentMethodsResponse>(
    GET_PAYMENT_METHODS,
    {
      variables: {
        input: {
          activeOnly: true,
        },
      },
    }
  );

  const [addPaymentMethodMutation] =
    useMutation<AddPaymentMethodResponse>(ADD_PAYMENT_METHOD);
  const [removePaymentMethodMutation] =
    useMutation<RemovePaymentMethodResponse>(REMOVE_PAYMENT_METHOD);
  const [setDefaultPaymentMethodMutation] =
    useMutation<SetDefaultPaymentMethodResponse>(SET_DEFAULT_PAYMENT_METHOD);

  const addPaymentMethod = async (
    provider: FundingProvider,
    methodType: FundingPaymentMethod,
    paymentToken: string,
    setAsDefault = false
  ) => {
    try {
      const { data } = await addPaymentMethodMutation({
        variables: {
          input: {
            provider,
            methodType,
            paymentToken,
            setAsDefault,
          },
        },
      });

      if (!data?.addPaymentMethod?.success) {
        throw new Error(
          data?.addPaymentMethod?.error?.message ||
            "Failed to add payment method"
        );
      }

      await refetch();
      return data.addPaymentMethod;
    } catch (error) {
      console.error("Add payment method error:", error);
      throw error;
    }
  };

  const removePaymentMethod = async (paymentMethodId: string) => {
    try {
      const { data } = await removePaymentMethodMutation({
        variables: {
          input: { paymentMethodId },
        },
      });

      if (!data?.removePaymentMethod?.success) {
        throw new Error(
          data?.removePaymentMethod?.error?.message ||
            "Failed to remove payment method"
        );
      }

      await refetch();
      return data.removePaymentMethod;
    } catch (error) {
      console.error("Remove payment method error:", error);
      throw error;
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const { data } = await setDefaultPaymentMethodMutation({
        variables: {
          input: { paymentMethodId },
        },
      });

      if (!data?.setDefaultPaymentMethod?.success) {
        throw new Error(
          data?.setDefaultPaymentMethod?.error?.message ||
            "Failed to set default payment method"
        );
      }

      await refetch();
      return data.setDefaultPaymentMethod;
    } catch (error) {
      console.error("Set default payment method error:", error);
      throw error;
    }
  };

  return {
    paymentMethods: data?.getPaymentMethods?.paymentMethods || [],
    loading,
    error,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    refetch,
  };
}
