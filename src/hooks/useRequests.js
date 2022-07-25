import React, { useEffect, useState } from "react";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { WebsocketNotification } from "@inrupt/solid-client-notifications";
import {
  createContainerAt,
  createSolidDataset,
  getFile,
  getPodUrlAll,
  getSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getProfileImage } from "./utils";

const useRequests = (props) => {
  const { session } = useSession();
  const [requests, setRequests] = useState();

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
  return {
    requests,
  };
};

export default useRequests;
