import gql from 'graphql-tag';

export const GET_PULLREQUESTS = gql`
  query {
    viewer {
      login
    }
  }
`;
