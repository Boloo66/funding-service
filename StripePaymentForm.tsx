import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  // LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/funding/success",
        },
        redirect: "if_required",
      });

      if (error) {
        onError(new Error(error.message));
      } else {
        onSuccess();
      }
    } catch (error) {
      onError(error as Error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <PaymentElement options={{ paymentMethodOrder: ["link"] }} />
      {/** 
      <LinkAuthenticationElement options={{ defaultValues: { email: "" } }} /> 
      */}
      LINK
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

interface StripePaymentFormProps {
  clientSecret: string;
  sessionId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function StripePaymentForm({
  clientSecret,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="stripe-container">
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          clientSecret={clientSecret}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
}
