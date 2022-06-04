import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexWrapper, ProfileImage } from "../common/Components";
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
const Profile = styled(ProfileImage)`
  width: 30px;
  height: 30px;
`;

function MessageBar({ detail, myRole, members, self }) {
  const [myProfile, setMyProfile] = useState("");
  const [objectProfile, setObjectProfile] = useState("");

  useEffect(() => {
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

  function generateReadableTime(time) {
    const startIndex = new Date(time.toDate()).toLocaleString();
    return new Date(time.toDate()).toLocaleString().slice(startIndex, -3);
  }

  return detail.sender === myRole ? (
    <Wrapper>
      <SendDate>{generateReadableTime(detail.timestamp)}</SendDate>
      <FlexWrapper>
        <MessageSentByMe>
          <MessageInnerWrapperMe>{detail.content}</MessageInnerWrapperMe>
          <Profile src={myProfile && myProfile} />
        </MessageSentByMe>
      </FlexWrapper>
    </Wrapper>
  ) : (
    <Wrapper>
      <SendDate>{generateReadableTime(detail.timestamp)}</SendDate>
      <MessageSentByOthers>
        <Profile src={objectProfile && objectProfile} />
        <MessageInnerWrapperOthers>{detail.content}</MessageInnerWrapperOthers>
      </MessageSentByOthers>
    </Wrapper>
  );
}

MessageBar.propTypes = {
  detail: PropTypes.object.isRequired,
  myRole: PropTypes.number.isRequired,
  members: PropTypes.array.isRequired,
  self: PropTypes.object.isRequired,
};

export default MessageBar;
