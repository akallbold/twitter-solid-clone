import { useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { fetch } from "@inrupt/solid-client-authn-browser";
import useFriends from "./useFriends";

const useRequests = () => {
  const { session } = useSession();
  const [requests, setRequests] = useState();
  const friendDataset = useFriends();

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
            }
            return `Returned response status of:  ${response.status}`;
          })
          .then((data) => {
            if (data) {
              console.log("IN REQUEST", { data });
              const vcString = "verifiableCredential";
              setRequests(data[vcString]);
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
