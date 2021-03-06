import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Firebase } from "../../utils/firebase";

import styled from "styled-components";
import { FlexColumn, FlexWrapper, ProfileImage } from "../common/Components";
import CreateNewPostModal from "../modals/CreateNewPost";
import Post from "./Post";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  align-items: flex-start;
`;

const SubtitlesSmall = styled(FlexWrapper)`
  margin-bottom: 10px;
`;

const TitleSmall = styled.div`
  font-weight: 700;
`;

const NewPostButton = styled(FlexWrapper)`
  width: calc(100% - 40px);
  height: 85px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  padding: 0px 20px;
`;

const Profile = styled(ProfileImage)`
  width: 40px;
  height: 40px;
`;

const FakeInput = styled(FlexWrapper)`
  width: calc(100% - 60px);
  height: 45px;
  background: #f2f5f7;
  border-radius: 20px;
  align-items: center;
  padding-left: 10px;
  margin-left: 10px;
  cursor: pointer;
  color: #a1aeb7;

  &:hover {
    background: #e8e8e8;
  }
`;

const Posts = styled(FlexColumn)`
  width: 100%;
  margin-bottom: 20px;
`;

export default function GroupPosts({ currentUser, groupID, setPostStatus }) {
  const [openPost, setOpenPost] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "posts"),
      Firebase.where("groupID", "==", groupID),
      Firebase.orderBy("createTime", "desc")
    );
    Firebase.onSnapshot(query, (snapshot) => {
      if (!mounted) return;
      setPosts(snapshot.docs.map((doc) => doc.data()));
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <Wrapper>
      {openPost && (
        <CreateNewPostModal
          toggle={() => setOpenPost(false)}
          currentUser={currentUser}
          groupID={groupID}
          setPosted={setPostStatus}
        />
      )}

      <NewPostButton>
        <Profile src={currentUser.profileImage} />
        <FakeInput
          onClick={() => {
            setOpenPost(true);
          }}
        >
          ????????????
        </FakeInput>
      </NewPostButton>

      <SubtitlesSmall>
        <TitleSmall>????????????</TitleSmall>
      </SubtitlesSmall>
      <Posts>
        {posts.length && posts.find((post) => post.isOnTop) ? (
          <Post
            key={posts.find((post) => post.isOnTop).id}
            post={posts.find((post) => post.isOnTop)}
            currentUser={currentUser}
            setPostStatus={setPostStatus}
          />
        ) : (
          "????????????"
        )}
      </Posts>
      <SubtitlesSmall>
        <TitleSmall>????????????</TitleSmall>
      </SubtitlesSmall>
      <Posts>
        {posts.filter((post) => !post.isOnTop).length
          ? posts
              .filter((post) => !post.isOnTop)
              .map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  setPostStatus={setPostStatus}
                />
              ))
          : "????????????"}
      </Posts>
    </Wrapper>
  );
}

GroupPosts.propTypes = {
  currentUser: PropTypes.object,
  groupID: PropTypes.string,
  setPostStatus: PropTypes.func,
};
