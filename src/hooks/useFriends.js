import { useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import useUser from "./useUser";

const useFriends = () => {
  const { friendDatasetIri } = useUser();
  const { session } = useSession();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // TODO handle if friend dataset is 403 or you don't have access
    // TODO delete duplicate friends
    if (session.info.isLoggedIn && friendDatasetIri) {
      const getFriendsFromPod = async () => {
        try {
          // const dataset = await getSolidDataset(friendDatasetIri, {
          //   fetch,
          // });
          // const friendObjects = convertFriendThingsToJSObjects(dataset);
          // console.log("friendHOok", { dataset, friendObjects });
          // setFriends(friendObjects);
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
