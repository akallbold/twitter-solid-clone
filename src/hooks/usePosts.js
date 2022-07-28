import { useEffect, useState } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { convertTweetDatasetToJSObjects, sortTweetsByDate } from "./utils";
import useUser from "./useUser";
import useFriends from "./useFriends";

const usePosts = () => {
  const { session } = useSession();
  const { tweetDatasetIri, tweetDataset, friendDataset } = useUser();
  const { friends } = useFriends();
  const [posts, setPosts] = useState();

  useEffect(() => {
    if (session.info.isLoggedIn) {
      let newTweets = [];
      const getTweets = async () => {
        try {
          const dataset = await getSolidDataset(tweetDatasetIri, {
            fetch,
          });
          console.log({ dataset });
          const myTweets = convertTweetDatasetToJSObjects(dataset);
          console.log({ myTweets });

          let friendTweets = [];
          friends.forEach(async (friendThing) => {
            if (friendThing.dataUrl) {
              console.log();
              // TODO handle if tweet dataset is 403 - if friends dont have a twitterdataset or you don't have access
              // TODO getUrlOfFriendTweetDataset() we are hardcoding for now - can I get storage from webId profile (pim:storage)
              // const friendTweetDataset = await getSolidDataset(
              //   friendThing.dataUrl,
              //   { fetch }
              // );
              // friendTweets = convertTweetDatasetToJSObjects(friendTweetDataset);
              // console.log({ friendTweets });
            }
          });
          setTimeout(() => {
            newTweets = [...myTweets, ...friendTweets];
            const sortedTweets = sortTweetsByDate(newTweets);
            console.log({ sortedTweets, newTweets, myTweets, friendTweets });
            setPosts(sortedTweets);
          }, 2000);
        } catch (e) {
          console.log(e);
        }
      };
      getTweets();
    }
  }, [
    session.info.isLoggedIn,
    tweetDataset,
    friendDataset,
    friends,
    tweetDatasetIri,
  ]);

  return { posts };
};

export default usePosts;
