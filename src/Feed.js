import React from "react";
import "./Feed.css";
import TweetBox from "./TweetBox";
import Post from "./Post";
import FlipMove from "react-flip-move";
import usePosts from "./hooks/usePosts";
import useFriends from "./hooks/useFriends";

function Feed() {
  const { friends } = useFriends();
  const { posts } = usePosts();

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <TweetBox />

      <FlipMove>
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
      </FlipMove>
      <FlipMove>{friends && friends.map((friend) => <p>{friend}</p>)}</FlipMove>
    </div>
  );
}

export default Feed;
