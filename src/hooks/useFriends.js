import { useEffect, useState } from "react";
import { getSolidDataset } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { convertFriendThingsToJSObjects } from "./utils";
import useUser from "./useUser";

const useFriends = () => {
  const { friendDatasetIri } = useUser();
  const { session } = useSession();
  const [friends, setFriends] = useState();

  useEffect(() => {
    // TODO handle if friend dataset is 403
    // TODO delete duplicate friends
    if (session.info.isLoggedIn && friendDatasetIri) {
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
  }, [session, friendDatasetIri]);

  return {
    friends,
  };
};

export default useFriends;
