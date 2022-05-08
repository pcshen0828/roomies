import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";

const SendDate = styled.div`
  font-size: 12px;
  color: #505d68;
  align-self: center;
  margin: 30px 0 20px;
`;

const SendTime = styled.div`
  font-size: 12px;
  color: #505d68;
  margin: 0 0 10px;
  position: absolute;
  right: 10px;
  bottom: 5px;
`;

const MessageSentByMe = styled(FlexWrapper)`
  align-self: flex-end;
  margin-bottom: 5px;
  align-items: flex-end;
  justify-content: flex-end;
`;

const MessageInnerWrapperMe = styled(FlexWrapper)`
  background: #c2d1d9;
  border-radius: 20px 20px 0px 20px;
  padding: 10px 70px 15px 20px;
  align-items: center;
  max-width: 70%;
  position: relative;
  margin-right: 5px;
`;

const MessageSentByOthers = styled(FlexWrapper)`
  align-self: flex-start;
  margin-bottom: 5px;
  align-items: flex-end;
  justify-content: flex-start;
`;

const MessageInnerWrapperOthers = styled(FlexWrapper)`
  background: #f2f5f7;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 70px 15px 20px;
  border-radius: 20px 20px 20px 0px;
  padding: 10px 70px 15px 20px;
  position: relative;
  max-width: 70%;
  align-items: center;
  margin-left: 5px;
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

function MessageBar({ detail, myRole, generateReadableDate, members, self }) {
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
    const startIndex =
      new Date(time.toDate()).toLocaleString().indexOf("午") - 1;
    return new Date(time.toDate()).toLocaleString().slice(startIndex, -3);
  }

  return detail.sender === myRole ? (
    <>
      <SendDate>{generateReadableDate(detail.timestamp)}</SendDate>
      <MessageSentByMe ref={scrollRef}>
        <MessageInnerWrapperMe>
          {detail.content}
          <SendTime>{generateReadableTime(detail.timestamp)}</SendTime>
        </MessageInnerWrapperMe>
        <ProfileImage src={myProfile && myProfile} />
      </MessageSentByMe>
    </>
  ) : (
    <>
      <SendDate>{generateReadableDate(detail.timestamp)}</SendDate>
      <MessageSentByOthers ref={scrollRef}>
        <ProfileImage src={objectProfile && objectProfile} />
        <MessageInnerWrapperOthers>
          {detail.content}
          <SendTime>{generateReadableTime(detail.timestamp)}</SendTime>
        </MessageInnerWrapperOthers>
      </MessageSentByOthers>
    </>
  );
}

export default MessageBar;
