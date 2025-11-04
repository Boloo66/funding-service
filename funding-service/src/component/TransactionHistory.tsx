import { useTransactionHistory } from "../hooks/useTransactionHistory";
import type { Transaction, FundingStatus } from "../types/funding.types";

export default function TransactionHistory() {
  const {
    transactions = [],
    loading,
    totalCount = 0,
  } = useTransactionHistory({ limit: 20 });

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="empty-state">No transactions yet</div>;
  }

  const getStatusColor = (status: FundingStatus | string) => {
    switch (status) {
      case "COMPLETED":
        return "status-success";
      case "PENDING":
      case "PROCESSING":
        return "status-warning";
      case "FAILED":
      case "CANCELLED":
        return "status-danger";
      default:
        return "";
    }
  };

  const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const formatDate = (value?: number | string) => {
    if (!value) return "";
    const d = typeof value === "number" ? new Date(value) : new Date(value);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="transaction-history">
      <h3>Transaction History ({totalCount})</h3>
      <div className="transactions-list">
        {transactions.map((tx: Transaction) => (
          <div key={tx.id} className="transaction-item">
            <div className="transaction-main">
              <div className="transaction-info">
                <div className="transaction-amount">
                  {formatAmount(tx.amountCents)}
                </div>
                <div className="transaction-method">
                  {tx.method} via {tx.provider}
                </div>
              </div>
              <div
                className={`transaction-status ${getStatusColor(tx.status)}`}
              >
                {tx.status}
              </div>
            </div>
            <div className="transaction-details">
              <span className="transaction-id">ID: {tx.transactionId}</span>
              <span className="transaction-date">
                {formatDate(tx.createdAt)}
              </span>
            </div>
            {tx.feeCents > 0 && (
              <div className="transaction-fee">
                Fee: {formatAmount(tx.feeCents)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
