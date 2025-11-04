import { apolloClient } from "./graphql/client";
import FundingDashboard from "./components/FundingDashboard";
import "./App.css";
import { ApolloProvider } from "@apollo/client/react";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <FundingDashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
