import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT ?? "http://localhost:4010/graphql",
  credentials: "include",
});

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("authToken");
  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

type InternalErrorContext = {
  response?: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    errors?: readonly { message: string; locations?: any; path?: any }[];
  };
  networkError?: Error;
  operation?: { operationName?: string };
};

const errorLink = new ErrorLink((context) => {
  const { response, networkError, operation } = context as InternalErrorContext;

  if (response?.errors) {
    for (const err of response.errors) {
      console.error(
        `[GraphQL error]: Operation: ${operation?.operationName}, Message: ${err.message}, Path: ${err.path}`
      );

      if (err.message.includes("UNAUTHENTICATED")) {
        localStorage.removeItem("authToken");
        window.location.href = "/login"; //Redirect to login page from web view
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
