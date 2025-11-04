import { usePaymentMethods } from "../hooks/usePaymentMethods";
import type { PaymentMethod } from "../types/funding.types";

export default function PaymentMethodsList() {
  const {
    paymentMethods,
    loading,
    removePaymentMethod,
    setDefaultPaymentMethod,
  } = usePaymentMethods();

  if (loading) {
    return <div className="loading">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return <div className="empty-state">No payment methods added yet</div>;
  }

  const handleRemove = async (id: string) => {
    if (
      window.confirm("Are you sure you want to remove this payment method?")
    ) {
      try {
        await removePaymentMethod(id);
      } catch (error) {
        console.error("Failed to remove payment method:", error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    }
  };

  return (
    <div className="payment-methods-list">
      <h3>Payment Methods</h3>
      {paymentMethods.map((pm: PaymentMethod) => (
        <div key={pm.id} className="payment-method-item">
          <div className="payment-method-info">
            <div className="payment-method-brand">
              {pm.brand || pm.provider}{" "}
              {pm.isDefault && <span className="badge">Default</span>}
            </div>
            <div className="payment-method-details">
              {pm.lastFour && `•••• ${pm.lastFour}`}
              {pm.bankDetails && ` - ${pm.bankDetails.name}`}
            </div>
          </div>
          <div className="payment-method-actions">
            {!pm.isDefault && (
              <button
                onClick={() => handleSetDefault(pm.id)}
                className="btn btn-sm btn-secondary"
              >
                Set Default
              </button>
            )}
            <button
              onClick={() => handleRemove(pm.id)}
              className="btn btn-sm btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
