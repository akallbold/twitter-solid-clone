import React from "react";
import "./Sidebar.css";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button } from "@material-ui/core";
import { useSession } from "@inrupt/solid-ui-react";
import { login, logout } from "@inrupt/solid-client-authn-browser";

function Sidebar() {
  const { session } = useSession();
  const authButton = (s) => {
    if (!s.info.isLoggedIn) {
      return (
        <Button
          variant="outlined"
          className="sidebar__tweet"
          fullWidth
          onClick={() =>
            login({
              oidcIssuer: "https://login.inrupt.com/",
              clientName: "Solid Twitter",
            })
          }
        >
          Login to Pod
        </Button>
      );
    } else {
      return (
        <>
          <Button
            variant="outlined"
            className="sidebar__tweet"
            fullWidth
            onClick={() => logout()}
          >
            Logout of {session.info.webId}
          </Button>
          {/* <p>Logged in as </p> */}
        </>
      );
    }
  };

  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar__twitterIcon" />
      {authButton(session)}
      <SidebarOption active Icon={HomeIcon} text="Home" />
      <SidebarOption Icon={SearchIcon} text="Explore" />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
      <SidebarOption Icon={ListAltIcon} text="Lists" />
      <SidebarOption Icon={PermIdentityIcon} text="Profile" />
      <SidebarOption Icon={MoreHorizIcon} text="More" />

      <Button variant="outlined" className="sidebar__tweet" fullWidth>
        Tweet
      </Button>
    </div>
  );
}

export default Sidebar;
