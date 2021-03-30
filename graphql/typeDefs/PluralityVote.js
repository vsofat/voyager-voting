import { gql } from "apollo-server-micro";

export default gql`
  type PluralityVote {
    id: ObjectId!
    gradYear: Int
    choice: Candidate
  }
`;