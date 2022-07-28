import React, { useState } from "react";
import "./Widgets.css";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import useUser from "./hooks/useUser";
import { useSession } from "@inrupt/solid-ui-react";
import { v4 as uuidv4 } from "uuid";
import {
  addDatetime,
  addInteger,
  addStringNoLocale,
  addUrl,
  createThing,
  saveSolidDatasetAt,
  setThing,
  getProfileAll,
  getPodUrlAll,
  deleteSolidDataset,
} from "@inrupt/solid-client";
import {
  getAccessApiEndpoint,
  issueAccessRequest,
  redirectToAccessManagementUi,
} from "@inrupt/solid-client-access-grants";
import { fetch } from "@inrupt/solid-client-authn-browser";

import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { Cancel } from "@material-ui/icons";
import { clientID, clientSecret, oidcIssuer } from "./constants";
function Widgets() {
  const { friendDataset, setFriendDataset, friendDatasetIri } = useUser();
  const [friendText, setFriendText] = useState("");
  const { session } = useSession();

  const createFriendThing = () => {
    const id = uuidv4();
    const storage =
      session.info.webId === "https://id.inrupt.com/akbprod12"
        ? "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/Solid_Twitter/twitterData" // this is annaprod122
        : "https://storage.inrupt.com/16b1fd53-9348-41ea-8b1a-0dad5cf016a1/Solid_Twitter/twitterData"; // this is akbprod12
    console.log({ storage });
    let myFriendThing = createThing({ name: `friend-${id}` });
    myFriendThing = addStringNoLocale(
      myFriendThing,
      SCHEMA_INRUPT.name,
      friendText
    );
    myFriendThing = addInteger(myFriendThing, SCHEMA_INRUPT.identifier, id);
    myFriendThing = addDatetime(
      myFriendThing,
      SCHEMA_INRUPT.dateModified,
      new Date()
    );
    // TODO how to get friend's tweet dataset URL
    myFriendThing = addUrl(myFriendThing, SCHEMA_INRUPT.url, storage);
    return myFriendThing;
  };

  const saveFriend = async () => {
    const myFriendThing = createFriendThing();
    let updatedDataset = friendDataset;
    updatedDataset = setThing(updatedDataset, myFriendThing);

    try {
      await saveSolidDatasetAt(friendDatasetIri, updatedDataset, {
        fetch,
      });
      setFriendDataset(updatedDataset);
    } catch (e) {
      console.log(e);
    }
  };

  const createAccessGrant = async () => {
    // TODO
    console.log({ friendText });
    const podsUrls = await getPodUrlAll(friendText, { fetch });
    const podAddress = podsUrls[0];
    console.log({ podsUrls, podAddress });
    const datasetAddress = podAddress + "Solid_Twitter/twitterData";
    console.log(
      `I want to access this dataset ${datasetAddress} from this webId ${friendText}`
    );
    let accessExpiration = new Date(Date.now() + 1555 * 60000);
    try {
      const requestVC = await issueAccessRequest(
        {
          access: { read: true },
          resources: [datasetAddress],
          //   resources: [
          //     "https://storage.inrupt.com/97cfd0be-a46a-4da3-908c-ad6ea602d37b/CRUD_Module/",
          //   ],
          resourceOwner: friendText,
          //   resourceOwner: "https://id.inrupt.com/docsteam12",
          expirationDate: accessExpiration,
          purpose: ["https://example.com/purposes#view_profile"],
        },
        { fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
      );
      console.log({ requestVC });
      return requestVC;
    } catch (e) {
      console.log(e);
    }

    // how do I know if I have a friend request (access grant)?
    // is there a way to know when an AG has been accepted? only then trigger adding friend to dataset

    // do we need this?
    // await session.login({
    //   clientId: env.clientId,
    //   clientSecret: env.clientSecret,
    //   oidcIssuer: env.oidcIssuer.href,
    //   // Note that using a Bearer token is mandatory for the UMA access token to be valid.
    //   tokenType: "Bearer",
    // });
  };

  const addFriend = async () => {
    await createAccessGrant();
    await saveFriend();
    setFriendText("");
  };

  const deleteDataset = async () => {
    try {
      await deleteSolidDataset(friendDatasetIri, {
        fetch,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input
          placeholder="Search for Friends"
          type="text"
          value={friendText}
          onChange={(e) => setFriendText(e.target.value)}
        />
        <Button onClick={addFriend}>search</Button>
      </div>
      <Cancel onClick={deleteDataset} />

      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>

        <TwitterTweetEmbed tweetId={"1399787983209996289"} />

        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="BarackObama"
          options={{ height: 400 }}
        />

        <TwitterShareButton
          url={"https://twitter.com/BarackObama"}
          options={{ text: "#barackObama", via: "barackObama" }}
        />
      </div>
    </div>
  );
}

export default Widgets;
