import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
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
  getPodUrlAll,
  deleteSolidDataset,
} from "@inrupt/solid-client";
import { issueAccessRequest } from "@inrupt/solid-client-access-grants";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { Cancel } from "@material-ui/icons";
import useUser from "./hooks/useUser";
import "./Widgets.css";

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
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const createAccessGrant = async () => {
    // TODO
    const podsUrls = await getPodUrlAll(friendText, { fetch });
    const podAddress = podsUrls[0];
    const datasetAddress = `${podAddress}Solid_Twitter/twitterData`;
    console.log(
      `I want to access this dataset ${datasetAddress} from this webId ${friendText}`
    );
    const accessExpiration = new Date(Date.now() + 1555 * 60000);
    try {
      const requestVC = await issueAccessRequest(
        {
          access: { read: true },
          resources: [datasetAddress],

          resourceOwner: friendText,
          expirationDate: accessExpiration,
          purpose: ["https://example.com/purposes#view_profile"],
        },
        { fetch }
      );
      console.log({ requestVC });
      return requestVC;
    } catch (e) {
      console.log(e);
    }
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
      </div>
    </div>
  );
}

export default Widgets;
