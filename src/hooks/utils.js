import {
  getBoolean,
  getDatetime,
  getFile,
  getInteger,
  getStringNoLocale,
  getThingAll,
  getUrl,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";

const getImageURL = (string) => `${string.slice(0, -11)}image.png`;

export const convertFriendThingsToJSObjects = (friendDataset) => {
  const output = [];
  const things = getThingAll(friendDataset);
  things.forEach(async (thing) => {
    const friendStorage = getUrl(thing, SCHEMA_INRUPT.url);
    const imageURL = getImageURL(friendStorage);
    const tempObject = {
      handle: getStringNoLocale(thing, SCHEMA_INRUPT.name),
      id: getInteger(thing, SCHEMA_INRUPT.identifier),
      date: getDatetime(thing, SCHEMA_INRUPT.dateModified),
      dataUrl: friendStorage,
      imageUrl: imageURL,
    };
    output.push(tempObject);
  });
  return output;
};

export const convertTweetDatasetToJSObjects = (tweetDataset) => {
  const output = [];
  const things = getThingAll(tweetDataset);
  things.forEach((thing) => {
    const tempObject = {
      text: getStringNoLocale(thing, SCHEMA_INRUPT.text),
      id: getInteger(thing, SCHEMA_INRUPT.identifier),
      date: getDatetime(thing, SCHEMA_INRUPT.dateModified),
      verified: getBoolean(thing, SCHEMA_INRUPT.value),
      avatar: getStringNoLocale(thing, SCHEMA_INRUPT.image),
      displayName: getStringNoLocale(thing, SCHEMA_INRUPT.name),
      username: getStringNoLocale(thing, SCHEMA_INRUPT.accountId),
    };
    output.push(tempObject);
  });
  return output;
};

export const sortTweetsByDate = (tweetArray) =>
  tweetArray.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

export const getProfileImage = async (url, callback) => {
  try {
    const image = await getFile(url, {
      fetch,
    });
    if (callback) callback(image);
    return image;
  } catch (e) {
    console.log(e);
  }
};
