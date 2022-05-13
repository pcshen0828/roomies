import React from "react";
import styled from "styled-components";
import { FlexColumn, FlexWrapper } from "../common/Components";
import CreateNewPostModal from "../modals/CreateNewPost";

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
  height: 100px;
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
  width: calc(100% - 80px);
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

export default function GroupNews({ currentUser }) {
  const [openPost, setOpenPost] = React.useState(false);

  return (
    <Wrapper>
      {openPost && <CreateNewPostModal />}
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
        <TitleSmall>所有貼文</TitleSmall>
      </SubtitlesSmall>
    </Wrapper>
  );
}
