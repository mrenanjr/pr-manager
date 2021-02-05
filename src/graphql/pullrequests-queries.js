import gql from 'graphql-tag';

export const GET_REPOSITORY = gql`
  query GetRepository($name: String!) {
    viewer {
      login
      repository(name: $name) {
        id
        name
      	nameWithOwner
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

export const GET_PULLREQUESTS = gql`
  query GetPullRequests($name: String!, $first: Int!, $after: String) {
    viewer {
      repository(name: $name) {
        description
        forkCount
      	collaborators {
          totalCount
        }
      	issues {
          totalCount
        }
      	pullRequests(first: $first, after: $after) {
        	totalCount
        	nodes {
            id
            url
            title
            state
            author {
              login
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
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
