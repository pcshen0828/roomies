import React from "react";
import styled from "styled-components";
import { FlexColumn, FlexWrapper } from "../common/Components";
import CreateNewPostModal from "../modals/CreateNewPost";
import { Firebase } from "../../utils/firebase";
import Post from "./Post";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  align-items: flex-start;
`;

const SubtitlesSmall = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TitleSmall = styled.div`
  font-weight: 700;
`;

const SubtitleSmall = styled.div`
  font-size: 14px;
  color: #a1aeb7;
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

const Profile = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
`;

export default function GroupPosts({
  currentUser,
  groupID,
  setPosted,
  setUpdated,
  setDeleted,
}) {
  const [openPost, setOpenPost] = React.useState(false);
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "posts"),
      Firebase.where("groupID", "==", groupID),
      Firebase.orderBy("createTime", "desc")
    );
    Firebase.onSnapshot(query, (snapshot) => {
      if (!mounted) return;
      console.log(snapshot.docs.map((doc) => doc.data()));
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
          toggle={setOpenPost}
          currentUser={currentUser}
          groupID={groupID}
          setPosted={setPosted}
        />
      )}

      <NewPostButton>
        <Profile src={currentUser.profileImage} />
        <FakeInput
          onClick={() => {
            setOpenPost(true);
          }}
        >
          發佈貼文
        </FakeInput>
      </NewPostButton>

      <SubtitlesSmall>
        <TitleSmall>置頂貼文</TitleSmall>
      </SubtitlesSmall>
      <Posts>
        {posts.length && posts.find((post) => post.isOnTop) ? (
          <Post
            key={posts.find((post) => post.isOnTop).id}
            post={posts.find((post) => post.isOnTop)}
            currentUser={currentUser}
            setDeleted={setDeleted}
          />
        ) : (
          "尚無貼文"
        )}
      </Posts>
      <SubtitlesSmall>
        <TitleSmall>所有貼文</TitleSmall>
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
                  setUpdated={setUpdated}
                  setDeleted={setDeleted}
                />
              ))
          : "尚無貼文"}
      </Posts>
    </Wrapper>
  );
}
