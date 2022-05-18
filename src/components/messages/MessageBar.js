import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";
import Linkify from "react-linkify";

const SendDate = styled.div`
  font-size: 12px;
  color: #505d68;
  align-self: center;
  margin: 30px 0 20px;
`;

const Wrapper = styled(Linkify)`
  display: flex;
  justify-content: flex-start;
`;

const MessageSentByMe = styled(FlexWrapper)`
  align-self: flex-end;
  margin-bottom: 5px;
  align-items: flex-end;
  justify-content: flex-end;
`;

const MessageInnerWrapperMe = styled.div`
  background: #c2d1d9;
  border-radius: 20px 20px 0px 20px;
  padding: 10px 20px 15px 20px;
  align-items: center;
  max-width: calc(90% - 40px);
  position: relative;
  margin-right: 5px;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
`;

const MessageSentByOthers = styled(FlexWrapper)`
  align-self: flex-start;
  margin-bottom: 5px;
  align-items: flex-end;
  justify-content: flex-start;
`;

const MessageInnerWrapperOthers = styled.div`
  background: #f2f5f7;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 70px 15px 20px;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 20px 15px 20px;
  position: relative;
  max-width: calc(90% - 40px);
  align-items: center;
  margin-left: 5px;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
`;
const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

function MessageBar({ detail, myRole, members, self }) {
  const scrollRef = React.useRef();
  const [myProfile, setMyProfile] = React.useState("");
  const [objectProfile, setObjectProfile] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    const myself = members.find((member) => member.uid === self.uid);
    setMyProfile(myself && myself.profileImage);
    const object = members.find((member) => member.uid !== self.uid);
    setObjectProfile(object && object.profileImage);

    return function cleanup() {
      mounted = false;
    };
  }, [self, members]);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail]);

  function generateReadableTime(time) {
    const startIndex = new Date(time.toDate()).toLocaleString();
    return new Date(time.toDate()).toLocaleString().slice(startIndex, -3);
  }

  return detail.sender === myRole ? (
    <Wrapper>
      <SendDate>{generateReadableTime(detail.timestamp)}</SendDate>
      <FlexWrapper>
        <MessageSentByMe>
          <MessageInnerWrapperMe ref={scrollRef}>
            {detail.content}
          </MessageInnerWrapperMe>
          <ProfileImage src={myProfile && myProfile} />
        </MessageSentByMe>
      </FlexWrapper>
    </Wrapper>
  ) : (
    <Wrapper>
      <SendDate>{generateReadableTime(detail.timestamp)}</SendDate>
      <MessageSentByOthers>
        <ProfileImage src={objectProfile && objectProfile} />
        <MessageInnerWrapperOthers ref={scrollRef}>
          {detail.content}
        </MessageInnerWrapperOthers>
      </MessageSentByOthers>
    </Wrapper>
  );
}

export default MessageBar;
