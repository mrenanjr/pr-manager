import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GITHUB_API,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);
  
  console.log(`Middleware: ${token}`);
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

export default client;
