import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "../../../comps/auth/UserContext";
import layout from "../../../styles/layout.module.css";
import Head from "next/head";
import BackButton from "../../../comps/shared/BackButton";
import Typography from "@material-ui/core/Typography";
import ElectionTabBar from "../../../comps/election/ElectionTabBar";
import ElectionNotFound from "../../../comps/election/ElectionNotFound";
import PluralityVote from "../../../comps/vote/PluralityVote";
import useFormatDate from "../../../utils/date/useFormatDate";
import Button from "@material-ui/core/Button";
import useLogin from "../../../comps/auth/useLogin";
import gingerCatAccessBlocked from "./../../../img/ginger-cat-access-blocked.png";
import cherryNoMessages from "./../../../img/cherry-no-messages.png";
import rush from "./../../../img/rush-20.png";
import Link from "next/link";
import voteSticker from "../../../img/sticker-vota.gif";
import LoadingScreen from "../../../comps/shared/LoadingScreen";
import RunoffVote from "../../../comps/vote/RunoffVote";
import Container from "@material-ui/core/Container";
import Image from "next/image";
import LockOpenIcon from "@material-ui/icons/LockOpen";

const QUERY = gql`
  query ($url: NonEmptyString!) {
    electionByUrl(url: $url) {
      id
      type
      name
      start
      end
      completed
      candidates(sort: random) {
        id
        name
      }
      picture {
        id
        alt
        resource {
          url
          height
          width
          resourceType
          format
        }
      }
      userIsEligible
      isOpen
    }
    userHasVoted(election: { url: $url })
  }
`;

export default function Vote() {
  const router = useRouter();
  const { url } = router.query;
  const { data, refetch, loading } = useQuery(QUERY, { variables: { url } });
  const { now, getReadableDate } = useFormatDate(true, 1000);
  const user = useContext(UserContext);
  const { signIn } = useLogin({ onLogin: refetch });

  // Update the election open form every 5 seconds
  const election = data?.electionByUrl;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  const voteId = globalThis?.localStorage?.getItem("vote-id-" + election.id);

  const start = new Date(election.start);
  const end = new Date(election.end);

  // Determine this locally to avoid refreshing
  const isOpen = now > start && now < end && !election.completed;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>Vote - {election.name} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`Vote - ${election.name} | StuyBOE Voting Site`}
        />
        <meta property="og:description" content={`Vote for ${election.name}`} />
        <meta property="og:image" content={election.picture.resource?.url} />
        <meta property="og:image:alt" content={election.picture.alt} />
        <meta
          property="og:image:height"
          content={election.picture.resource.height}
        />
        <meta
          property="og:image:width"
          content={election.picture.resource.width}
        />
        <meta
          property="og:image:type"
          content={
            election.picture.resource.resourceType +
            "/" +
            election.picture.resource.format
          }
        />
      </Head>

      <BackButton
        href={"/election"}
        variant={"outlined"}
        text={"Back To Elections"}
      />

      <Typography variant={"h1"} className={layout.title} align={"center"}>
        {election.name}
      </Typography>

      <ElectionTabBar completed={election.completed} />

      {election.userIsEligible && isOpen && !data?.userHasVoted && (
        <Container maxWidth={"sm"}>
          {election.type === "plurality" && (
            <PluralityVote
              candidates={election.candidates}
              election={election}
              refetch={refetch}
            />
          )}

          {election.type === "runoff" && (
            <RunoffVote
              candidates={election.candidates}
              election={election}
              refetch={refetch}
            />
          )}
        </Container>
      )}

      {election.userIsEligible && !isOpen && (
        <>
          <Typography variant={"h2"} color={"secondary"} align={"center"}>
            This is election isn't open right now
          </Typography>

          <Image
            src={rush}
            alt={"A yoyo with a clock on it"}
            className={layout.smallVector}
          />

          {now < start && (
            <Typography variant={"body1"}>
              Starts {getReadableDate(start)}
            </Typography>
          )}

          {now > end && (
            <Typography variant={"body1"}>
              Ended {getReadableDate(end)}
            </Typography>
          )}

          {election.completed && (
            <Typography>
              <Link href={"/election/" + url + "/result"}>
                <Button variant={"outlined"} color={"primary"}>
                  Results
                </Button>
              </Link>{" "}
              &nbsp;for this election are available
            </Typography>
          )}
          <br />
        </>
      )}

      {data?.userHasVoted && (
        <>
          {isOpen && (
            <>
              <Typography variant={"h2"} color={"secondary"} align={"center"}>
                Thanks for voting!
              </Typography>
              <div className={layout.center}>
                <Image
                  src={voteSticker}
                  alt={
                    "A sticker that says vota (meant to be pronounced as voter)"
                  }
                  height={200}
                  width={200}
                  objectFit={"contain"}
                  className={layout.smallVector}
                />
              </div>
            </>
          )}

          {voteId ? (
            <div>
              <Typography variant={"h3"} align={"center"}>
                Your Vote ID is: <code className={layout.voteId}>{voteId}</code>
              </Typography>
              <Typography variant={"body1"} gutterBottom>
                You can use this code after the election is over to look up your
                vote and ensure that it was recorded accurately.
              </Typography>
              <Typography variant={"body1"}>
                We'll store this code in your browser for the time being but,
                because personally identifiable information is not stored with
                your vote,{" "}
                <b>we may be unable to show this code to you again</b>. It might
                be a good idea to write it down or take a screenshot of it.
              </Typography>
            </div>
          ) : (
            <Typography variant={"body1"} align={"center"}>
              Your vote id is not stored on this browser and cannot be
              displayed.
            </Typography>
          )}
        </>
      )}

      {user.signedIn && !election.userIsEligible && (
        <>
          <div className={layout.center}>
            <Image
              src={cherryNoMessages}
              alt={"A disappointed woman pointing at her phone"}
              className={layout.smallVector}
              height={200}
              width={200}
              objectFit={"contain"}
            />
          </div>
          <Typography
            paragraph
            variant={"body1"}
            className={layout.spaced}
            align={"center"}
          >
            You're not eligible to vote in this election
          </Typography>
        </>
      )}

      {!user.signedIn && (
        <>
          <div className={layout.center}>
            <Image
              src={gingerCatAccessBlocked}
              alt={"A sad cat in front of a lock"}
              height={200}
              width={200}
              objectFit={"contain"}
              className={layout.smallVector}
            />
          </div>

          <Typography gutterBottom paragraph variant={"body1"} align={"center"}>
            You need to be signed in to vote for this election
          </Typography>
          <div className={layout.center}>
            <Button
              variant={"contained"}
              onClick={signIn}
              color={"primary"}
              startIcon={<LockOpenIcon />}
            >
              Sign In
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
