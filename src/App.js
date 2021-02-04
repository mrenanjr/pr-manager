import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';

import GlobalStyle from './styles/global';
import Routes from "./routes";

import apolloClient from './services/apollo';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <GlobalStyle />
    </ApolloProvider>
  );
};

export default App;
