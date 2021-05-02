import { gql } from "apollo-server-micro";

export default gql`
  type Announcement {
    id: ObjectId!
    title: NonEmptyString!
    body: NonEmptyString!
    start: DateTime
    end: DateTime
    permanent: Boolean!
    election: Election
    showOnHome: Boolean!
  }
`;
