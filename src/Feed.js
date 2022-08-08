import React from "react";
import "./Feed.css";
import TweetBox from "./TweetBox";
import Post from "./Post";
import usePosts from "./hooks/usePosts";
import useFriends from "./hooks/useFriends";

function Feed() {
  const { friends } = useFriends();
  const { posts } = usePosts();

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>FreeBird</h2>
      </div>

      <TweetBox />

      {posts &&
        posts.map((post) => (
          <Post
            key={post.text}
            displayName={post.displayName}
            username={post.username}
            verified={post.verified}
            text={post.text}
            avatar={post.avatar}
            image={post.image}
          />
        ))}

      {friends && friends.map((friend) => <p>{friend.handle}</p>)}
    </div>
  );
}

export default Feed;
