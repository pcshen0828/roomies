import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SendMessageModal from "../modals/SendMessage";
import { useAuth } from "../../context/AuthContext";
import { Button1 } from "../common/Components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
`;

const defaultCardStyle = `
  width: 100%;
  border: 1px solid #c1b18a;
  border-radius: 10px;
  display: flex;
  margin-bottom: 40px;
`;
const MemberBlockWrapper = styled.div`
  ${defaultCardStyle}
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  height: 320px;
`;

const MembersBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const MemberBlockCard = styled.div`
  flex-direction: column;
`;

const Member = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 10px 10px;
`;

const MemberLink = styled(Link)`
  display: block;
  margin-right: 10px;
`;

const MemberImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.div`
  font-weight: 700;
`;

const MemberJobTitle = styled.div`
  font-size: 14px;
`;

const MessageButton = styled(Button1)`
  width: 100px;
  justify-self: end;
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

function GroupMember({ members }) {
  const [openModal, setOpenModal] = React.useState(false);
  const [objectId, setObjectId] = React.useState("");
  const { currentUser } = useAuth();

  return (
    <Wrapper>
      {openModal && (
        <SendMessageModal setOpenModal={setOpenModal} objectId={objectId} />
      )}
      <SubtitlesSmall>
        <TitleSmall>成員</TitleSmall>
        <SubtitleSmall></SubtitleSmall>
      </SubtitlesSmall>
      <MemberBlockWrapper>
        <MembersBlock>
          <MemberBlockCard>
            {members.find((member) => member.uid === currentUser.uid) && (
              <>☑︎已加入</>
            )}
            {members
              .filter((member) => member.uid !== currentUser.uid)
              .map((member, index) => (
                <Member key={index}>
                  <MemberLink to={`/users/${member.uid}`}>
                    <MemberImage src={member.profileImage} />
                  </MemberLink>
                  <MemberInfo>
                    <MemberName>{member.alias}</MemberName>
                    <MemberJobTitle>{member.jobTitle}</MemberJobTitle>
                  </MemberInfo>

                  <MessageButton
                    onClick={() => {
                      setOpenModal(true);
                      setObjectId(member.uid);
                    }}
                  >
                    發送訊息
                  </MessageButton>
                </Member>
              ))}
          </MemberBlockCard>
        </MembersBlock>
      </MemberBlockWrapper>
    </Wrapper>
  );
}

export default GroupMember;
