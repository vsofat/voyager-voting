import { gql } from "apollo-server-micro";

export default gql`
  """
  Inputs fields that can identify a single election. Only one needs to be provided
  """
  input electionIdentifier {
    """
    Url of the election. For the election at https://vote.stuysu.org/election/senior-caucus-20-21 the url is "senior-caucus-20-21"
    """
    url: String

    """
    Id of the election, must be a valid object id
    """
    id: ObjectId
  }

  type Query {
    """
    Returns the current user if authentication is provided (is signed in), otherwise returns null
    """
    authenticatedUser: User

    """
    Takes an object id and returns the election with the matching id
    """
    electionById(id: ObjectId!): Election

    """
    Takes a url and returns the matching election.
    Example: For the election at https://vote.stuysu.org/election/senior-caucus-20-21 the url is 'senior-caucus-20-21'
    """
    electionByUrl(url: String!): Election

    """
    Takes an object id and returns the candidate with the matching id
    """
    candidateById(id: ObjectId!): Candidate

    """
    Returns the candidate from the given election that has the specified url or null if there are no matches
    """
    candidateByUrl(url: String!, election: electionIdentifier!): Candidate

    """
    Returns elections that match the query regardless of completion status
    """
    allElections(
      """
      A string used to filter elections
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: Int! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: Int! = 9
    ): ElectionResult!

    """
    Returns elections that match the query that have completed set to false
    """
    openElections(
      """
      A string used to filter elections
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: Int! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: Int! = 9
    ): ElectionResult!

    """
    Returns users that match the given query
    """
    allUsers(
      """
      A string used to filter users
      """
      query: String! = ""
      """
      The page requested, if the query has more than one page of results.
      """
      page: Int! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: Int! = 9
    ): UserResult

    """
    Returns elections that match the query that have completed set to true
    """
    pastElections(
      """
      A string used to filter elections
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: Int! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: Int! = 9
    ): ElectionResult!

    """
    Admins Only!
    Returns all photos that were uploaded to the admin folder on cloudinary
    """
    adminPictures: [Picture!]!

    """
    Takes an object id and returns the picture object with the matching id
    """
    pictureById(id: ObjectId!): Picture

    """
    Returns the current datetime on the server
    """
    date: DateTime

    """
    Returns the current public key used to sign cross site requests
    """
    publicKey: PublicKey!
  }
`;
