import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSession } from "@inrupt/solid-ui-react";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getSolidDataset } from "@inrupt/solid-client";
import { Container } from "@mui/material";
import MyPanel from "../components/panels/MyPanel";
import MyTweets from "../components/panels/MyTweets";
import MyFriends from "../components/panels/MyFriends";
import {
  convertFriendThingsToJSObjects,
  convertTweetDatasetToJSObjects,
  sortTweetsByDate,
} from "./utils";

export default function Home(props) {
  const {
    containerIri,
    tweetDatasetIri,
    friendDatasetIri,
    tweetDataset,
    friendDataset,
    setTweetDataset,
    setFriendDataset,
    avatarURL,
  } = props;
  const { session } = useSession();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // TODO handle if tweet dataset is 403
    if (session.info.isLoggedIn && friendDataset) {
      const getFriendsFromPod = async () => {
        try {
          const dataset = await getSolidDataset(friendDatasetIri, {
            fetch,
          });
          const friendObjects = convertFriendThingsToJSObjects(dataset);
          setFriends(friendObjects);
        } catch (e) {
          console.log(e);
        }
      };
      getFriendsFromPod();
    }
  }, [session.info.isLoggedIn, friendDataset]);

  useEffect(() => {
    if (session.info.isLoggedIn) {
      let newTweets = [];
      const getTweets = async () => {
        try {
          const dataset = await getSolidDataset(tweetDatasetIri, {
            fetch,
          });

          const myTweets = convertTweetDatasetToJSObjects(dataset);
          let friendTweets = [];
          friends.forEach(async (friendThing) => {
            if (friendThing.dataUrl) {
              // TODO handle if tweet dataset is 403 - if friends dont have a twitterdataset
              // TODO getUrlOfFriendTweetDataset() we are hardcoding for now - can I get storage from webId profile (pim:storage)
              const friendTweetDataset = await getSolidDataset(
                friendThing.dataUrl,
                { fetch }
              );
              friendTweets = convertTweetDatasetToJSObjects(friendTweetDataset);
              console.log({ friendTweets });
            }
          });
          setTimeout(() => {
            newTweets = [...myTweets, ...friendTweets];
            const sortedTweets = sortTweetsByDate(newTweets);
            console.log({ sortedTweets, newTweets, myTweets, friendTweets });
            setTweets(sortedTweets);
          }, 2000);
        } catch (e) {
          console.log(e);
        }
      };
      getTweets();
    }
  }, [session.info.isLoggedIn, tweetDataset, friendDataset, friends]);

  const requestShape = JSON.stringify({
    verifiableCredential: {
      credentialSubject: {
        hasConsent: {
          hasStatus: "https://w3id.org/GConsent#ConsentStatusRequested",
        },
      },
    },
    options: {
      include: "ExpiredVerifiableCredential",
    },
  });

  useEffect(() => {
    if (session.info.isLoggedIn && friendDataset) {
      const getAccessRequestsForMyResource = async () => {
        console.log("gettingRequests");
        const reqOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestShape,
        };

        const url = `https://vc.inrupt.com/derive`;
        fetch(url, reqOptions)
          .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
              return response.json();
            } else {
              return `Returned response status of:  ${response.status}`;
            }
          })
          .then((data) => {
            if (data) {
              console.log("IN REQUEST", { data });
              setRequests(data["verifiableCredential"]);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };
      getAccessRequestsForMyResource();
    }
  }, [session.info.isLoggedIn]);

  return (
    <>
      {session.info.isLoggedIn ? (
        <Container
          sx={{
            flexDirection: "row",
            flexWrap: "no-wrap",
            display: "flex !important",
            paddingTop: "25px !important",
          }}
        >
          <MyPanel
            requests={requests}
            setTweets={setTweets}
            avatarURL={avatarURL}
          />
          <MyTweets
            containerIri={containerIri}
            tweets={tweets}
            tweetDataset={tweetDataset}
            tweetDatasetIri={tweetDatasetIri}
            setTweetDataset={setTweetDataset}
            setTweets={setTweets}
            avatarURL={avatarURL}
          />
          <MyFriends
            containerIri={containerIri}
            friends={friends}
            friendDataset={friendDataset}
            friendDatasetIri={friendDatasetIri}
            requests={requests}
            setFriendDataset={setFriendDataset}
          />
        </Container>
      ) : (
        <p>Please login</p>
      )}
    </>
  );
}

Home.propTypes = {
  containerIri: PropTypes.string.isRequired,
  friendDataset: PropTypes.object,
  tweetDataset: PropTypes.object,
  friendDatasetIri: PropTypes.string.isRequired,
  tweetDatasetIri: PropTypes.string.isRequired,
  setTweetDataset: PropTypes.func.isRequired,
  setFriendDataset: PropTypes.func.isRequired,
  avatarURL: PropTypes.string,
};
