import { useState } from "react";
import FundWalletModal from "./FundWalletModal";
import PaymentMethodsList from "./PaymentMethodsList";
import TransactionHistory from "./TransactionHistory";

export default function FundingDashboard() {
  const [showFundModal, setShowFundModal] = useState<boolean>(false);

  return (
    <div className="funding-dashboard">
      <div className="dashboard-header">
        <h1>Wallet Funding</h1>
        <button
          onClick={() => setShowFundModal(true)}
          className="btn btn-primary"
        >
          Add Funds
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <PaymentMethodsList />
        </div>

        <div className="dashboard-section">
          <TransactionHistory />
        </div>
      </div>

      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSuccess={() => {
          console.log("Funding successful!");
        }}
      />
    </div>
  );
}
