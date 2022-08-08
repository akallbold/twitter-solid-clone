import React from "react";
// import TwitterIcon from "@material-ui/icons/Twitter";
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
import { oidcIssuer, clientName } from "./constants";
import SidebarOption from "./SidebarOption";
import "./Sidebar.css";

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
              oidcIssuer,
              clientName,
            })
          }
        >
          Login to Pod
        </Button>
      );
    }
    return (
      <Button
        variant="outlined"
        className="sidebar__tweet"
        fullWidth
        onClick={() => logout()}
      >
        Logout of {session.info.webId}
      </Button>
    );
  };

  return (
    <div className="sidebar">
      <img className="sidebar__twitterIcon" src="solid.png" alt="solid logo" />
      {authButton(session)}
      <SidebarOption active Icon={HomeIcon} text="Home" />
      <SidebarOption Icon={SearchIcon} text="Explore" />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
      <SidebarOption Icon={ListAltIcon} text="Lists" />
      <SidebarOption Icon={PermIdentityIcon} text="Profile" />
      <SidebarOption Icon={MoreHorizIcon} text="More" />
    </div>
  );
}

export default Sidebar;
