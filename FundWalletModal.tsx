import { useState } from "react";
import { useFunding, type InitiateFundingResponse } from "../hooks/useFunding";
import type {
  FundingProvider,
  FundingPaymentMethod,
  InitiateFundingInput,
} from "../types/funding.types";
import StripePaymentForm from "./StripePaymentForm";
import PlaidBankLink from "./PlaidBankLink";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FundWalletModal({
  isOpen,
  onClose,
  onSuccess,
}: FundWalletModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [provider, setProvider] = useState<FundingProvider>("STRIPE");
  const [method, setMethod] = useState<FundingPaymentMethod>("CREDIT_CARD");
  const [sessionData, setSessionData] = useState<
    InitiateFundingResponse["initiateFunding"] | null
  >(null);
  const [error, setError] = useState<string>("");

  const { initiateFunding, loading } = useFunding();

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountCents = Math.round(parseFloat(amount) * 100);

    if (amountCents < 100) {
      setError("Minimum amount is $1.00");
      return;
    }

    try {
      const input: InitiateFundingInput = {
        amountCents,
        currency: "CAD",
        method,
        provider,
        returnUrl: window.location.origin + "/funding/callback", //This will work for web url @Maurice
      };

      const result = await initiateFunding(input);
      setSessionData(result);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSuccess = () => {
    setSessionData(null);
    setAmount("");
    onSuccess?.();
    onClose();
  };

  const handleError = (err: Error) => {
    setError(err.message);
    setSessionData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Fund Your Wallet</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!sessionData ? (
          <form onSubmit={handleInitiate} className="modal-body">
            <div className="form-group">
              <label>Amount (CAD)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Payment Provider</label>
              <select
                value={provider}
                onChange={(e) => {
                  const newProvider = e.target.value as FundingProvider;
                  setProvider(newProvider);
                  if (newProvider === "PLAID") {
                    setMethod("BANK_TRANSFER");
                  }
                }}
                className="form-select"
              >
                <option value={"STRIPE"}>Stripe (Card)</option>
                <option value={"PLAID"}>Plaid (Bank Transfer)</option>
              </select>
            </div>

            {provider === "STRIPE" && (
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value as FundingPaymentMethod)
                  }
                  className="form-select"
                >
                  <option value={"CREDIT_CARD"}>Credit Card</option>
                  <option value={"DEBIT_CARD"}>Debit Card</option>
                </select>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body">
            {sessionData.clientSecret && provider === "STRIPE" ? (
              <StripePaymentForm
                clientSecret={sessionData.clientSecret}
                sessionId={sessionData.sessionId as unknown as string}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            ) : sessionData.linkToken && provider === "PLAID" ? (
              <PlaidBankLink
                linkToken={sessionData.linkToken}
                sessionId={sessionData.sessionId as unknown as string}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
