import { gql } from "@apollo/client";

export const MY_PROJECTS = gql`
query MyTaskLists {
  myTaskLists {
    id
    title
    createdAt
  }
}
`;
