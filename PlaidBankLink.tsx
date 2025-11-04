import { usePlaidLink } from "react-plaid-link";
import { useEffect } from "react";
import { useFunding } from "../hooks/useFunding";
import { useMutation } from "@apollo/client/react";
import { VERIFY_BANK_ACCOUNT } from "../graphql/mutations";

interface PlaidBankLinkProps {
  linkToken: string;
  sessionId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function PlaidBankLink({
  linkToken,
  sessionId,
  onSuccess,
  onError,
}: PlaidBankLinkProps) {
  const { processFunding } = useFunding();
  const [verifyBankAccount] = useMutation(VERIFY_BANK_ACCOUNT);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        await verifyBankAccount({
          variables: {
            input: {
              publicToken,
              accountId: metadata.accounts[0].id,
            },
          },
        });

        await processFunding({
          sessionId,
          paymentToken: publicToken,
          providerSpecificData: {
            accountId: metadata.accounts[0].id,
          },
        });

        onSuccess();
      } catch (error) {
        onError(error as Error);
      }
    },
    onExit: (error) => {
      if (error) {
        onError(new Error(error.error_message));
      }
    },
  });

  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return (
    <div className="plaid-link-container">
      <p>Connect your bank account with Plaid</p>
      <button
        onClick={() => open()}
        disabled={!ready}
        className="btn btn-primary"
      >
        {ready ? "Open Plaid" : "Loading..."}
      </button>
    </div>
  );
}
