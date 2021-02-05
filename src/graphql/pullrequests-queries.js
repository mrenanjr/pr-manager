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
  query GetPullRequests($name: String!, $first: Int!) {
    viewer {
      repository(name: $name) {
        description
        forkCount
        owner {
          avatarUrl
        }
      	collaborators {
          totalCount
        }
      	issues {
          totalCount
        }
      	pullRequests(first: $first) {
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
