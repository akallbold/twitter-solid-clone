import React, { useState } from "react";
import { Avatar, Button } from "@material-ui/core";
import {
  addBoolean,
  addDatetime,
  addInteger,
  addStringNoLocale,
  createThing,
  deleteSolidDataset,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "@inrupt/solid-ui-react";
import { Cancel } from "@material-ui/icons";
import useUser from "./hooks/useUser";
import "./TweetBox.css";

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const { session } = useSession();
  const { tweetDatasetIri, tweetDataset, setTweetDataset, avatarURL } =
    useUser();

  const createTweetThing = () => {
    // TODO dynamically get the name
    const name =
      session.info.webId === "https://id.inrupt.com/akbprod12"
        ? "akbprod12"
        : "annaprod122";
    const id = uuidv4();
    let myTweetThing = createThing({ name: `tweet-${id}` });
    myTweetThing = addStringNoLocale(
      myTweetThing,
      SCHEMA_INRUPT.text,
      tweetMessage
    );
    myTweetThing = addInteger(myTweetThing, SCHEMA_INRUPT.identifier, id);
    myTweetThing = addDatetime(
      myTweetThing,
      SCHEMA_INRUPT.dateModified,
      new Date()
    );
    myTweetThing = addBoolean(myTweetThing, SCHEMA_INRUPT.value, true);
    myTweetThing = addStringNoLocale(
      myTweetThing,
      SCHEMA_INRUPT.image,
      avatarURL
    );
    myTweetThing = addStringNoLocale(myTweetThing, SCHEMA_INRUPT.name, name);
    myTweetThing = addStringNoLocale(
      myTweetThing,
      SCHEMA_INRUPT.accountId,
      session.info.webId
    );
    return myTweetThing;
  };

  const saveTweet = async () => {
    const myTweetThing = createTweetThing();
    let updatedDataset = tweetDataset;
    updatedDataset = setThing(updatedDataset, myTweetThing);
    try {
      await saveSolidDatasetAt(tweetDatasetIri, updatedDataset, {
        fetch,
      });
      setTweetDataset(updatedDataset);
    } catch (e) {
      console.log(e);
    }
    setTweetMessage("");
  };

  const deleteDataset = async () => {
    try {
      await deleteSolidDataset(tweetDatasetIri, {
        fetch,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar src={avatarURL} />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
          />
        </div>
        <input
          onChange={(e) => setTweetImage(e.target.value)}
          value={tweetImage}
          className="tweetBox__imageInput"
          placeholder="Optional: Enter image URL"
          type="text"
        />
        <Button
          onClick={saveTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
        <Cancel onClick={deleteDataset} />
      </form>
    </div>
  );
}

export default TweetBox;
