import React, { useEffect, useState } from "react";
import {
  createContainerAt,
  createSolidDataset,
  getPodUrlAll,
  getSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { fetch } from "@inrupt/solid-client-authn-browser";

const useUser = (props) => {
  const { session } = useSession();
  const [podRootIri, setPodRootIri] = React.useState("");
  const [containerIri, setContainerIri] = useState("");
  const [tweetDatasetIri, setTweetDatasetIri] = useState("");
  const [friendDatasetIri, setFriendDatasetIri] = useState("");
  // const [notifications, setNotifications] = useState([]);
  const [tweetDataset, setTweetDataset] = useState(null);
  const [friendDataset, setFriendDataset] = useState(null);

  const avatarURL = containerIri + "image.png";

  const getPodAddress = async (webId) => {
    try {
      const allPods = await getPodUrlAll(webId, { fetch });
      setPodRootIri(allPods[0]);
      return allPods[0];
    } catch (e) {
      console.log(e);
    }
  };

  const createContainer = async (containerAddress) => {
    try {
      await createContainerAt(containerAddress, {
        fetch,
      });
      setContainerIri(containerAddress);
    } catch (e) {
      if (e.statusCode !== 412) console.log(e);
      setContainerIri(containerAddress);
    }
  };

  const createTweetDataset = async (datasetIri) => {
    try {
      const dataset = await getSolidDataset(datasetIri, { fetch });
      setTweetDatasetIri(datasetIri);
      setTweetDataset(dataset);
      return dataset;
    } catch (e) {
      if (e.statusCode === 404) {
        try {
          const dataset = createSolidDataset();
          const savedDataset = await saveSolidDatasetAt(datasetIri, dataset, {
            fetch,
          });
          setTweetDatasetIri(datasetIri);
          setTweetDataset(savedDataset);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const createFriendDataset = async (datasetIri) => {
    try {
      const dataset = await getSolidDataset(datasetIri, { fetch });
      setFriendDatasetIri(datasetIri);
      setFriendDataset(dataset);
      return dataset;
    } catch (e) {
      if (e.statusCode === 404) {
        try {
          const dataset = createSolidDataset();
          const savedDataset = await saveSolidDatasetAt(datasetIri, dataset, {
            fetch,
          });
          setFriendDatasetIri(datasetIri);
          setFriendDataset(savedDataset);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  useEffect(() => {
    async function initialSetup() {
      // TODO move these to constants
      const podAddress = await getPodAddress(session.info.webId);
      await createContainer(`${podAddress}Solid_Twitter/`);
      await createTweetDataset(`${podAddress}Solid_Twitter/twitterData`);
      await createFriendDataset(`${podAddress}Solid_Twitter/friendData`);
      // await getProfileImage(`${containerIri}image.png`, setMyProfileImage);
    }
    if (session.info.isLoggedIn) {
      initialSetup();
    }
  }, [session.info.isLoggedIn, session.info.webId]);

  // useEffect(() => {
  //   if (session.info.isLoggedIn && tweetDatasetIri && friendDatasetIri) {
  //     const websocket = new WebsocketNotification(tweetDatasetIri, { fetch });
  //     websocket.on('message', (d) => {
  //       setNotifications([...notifications, JSON.parse(d)]);
  //       console.log('message', JSON.parse(d));
  //     });
  //     websocket.connect();
  //     return () => {
  //       websocket.disconnect();
  //     };
  //   }
  // }, [tweetDatasetIri, friendDatasetIri]);

  return {
    avatarURL,
    containerIri,
    friendDataset,
    friendDatasetIri,
    podRootIri,
    tweetDataset,
    tweetDatasetIri,
    setFriendDataset,
    setTweetDataset,
  };
};

export default useUser;
