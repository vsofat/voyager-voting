import Election from "../../../models/election";
import { UserInputError } from "apollo-server-micro";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import Picture from "../../../models/picture";

export default async (
  _,
  { id, name, url, coverPicId, type, allowedGradYears, start, end },
  { adminRequired }
) => {
  adminRequired();

  fieldsCannotBeEmpty({ name, url, coverPicId });

  const election = await Election.findById(id);

  if (!election) {
    throw new UserInputError("There's no election with that ID");
  }

  if (url !== election.url) {
    // Check to make sure that there's no other election at that url
    const existingElection = await Election.findOne({ url });

    if (existingElection) {
      throw new UserInputError("There's another election at that url");
    }
  }

  if (end < start) {
    throw new UserInputError("The start date must be before the end date");
  }

  const coverPic = await Picture.findById(coverPicId);

  if (!coverPic) {
    throw new UserInputError("There's no picture with that id");
  }

  election.name = name;
  election.url = url;
  election.coverPicId = coverPicId;
  election.type = type;
  election.allowedGradYears = allowedGradYears;
  election.start = start;
  election.end = end;
  await election.save();

  return election;
};
