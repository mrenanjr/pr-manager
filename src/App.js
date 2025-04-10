import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';

import GlobalStyle from './styles/global';
import CustomRoutes from "./routes";

import apolloClient from './services/apollo';
import client from "./services/apollo";

export const apolloClearCache = () => {
  client.cache.reset();
}

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <CustomRoutes />
      </BrowserRouter>
      <GlobalStyle />
    </ApolloProvider>
  );
};

export default App;
