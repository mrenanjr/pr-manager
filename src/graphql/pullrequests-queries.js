import gql from 'graphql-tag';

export const GET_PULLREQUESTS = gql`
  query GetPullRequest($name: String!) {
    viewer {
      login
      repository(name: $name) {
      	id
      	name
      	description
      	url
      	createdAt
      	owner {
          avatarUrl
          login
        }
    	}
    }
  }
`;

// export const PROFILE_QUERY = gql`
//   query {
//     viewer {
//       login
//     }
//   }
// `;
