import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SendMessageModal from "./modals/SendMessage";
import { Firebase } from "../utils/firebase";

const MembersBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
`;
const defaultCardStyle = `
  width: 100%;
  border: 1px solid #c1b18a;
  border-radius: 10px;
  display: flex;
`;

const MemberBlockCard = styled.div`
  ${defaultCardStyle}
  flex-direction: column;
  overflow-y: scroll;
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

const MessageButton = styled.button`
  width: 100px;
  justify-self: end;
`;

const SubtitlesSmall = styled.div`
  display: flex;
  align-items: center;
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

  return (
    <>
      {openModal && (
        <SendMessageModal setOpenModal={setOpenModal} objectId={objectId} />
      )}
      <MembersBlock>
        <SubtitlesSmall>
          <TitleSmall>成員</TitleSmall>
          <SubtitleSmall></SubtitleSmall>
        </SubtitlesSmall>
        <MemberBlockCard>
          {members.map((member, index) => (
            // 如果是自己的話，渲染另外的 component
            <Member key={index}>
              <MemberLink to={`/members/${member.uid}`}>
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
    </>
  );
}

export default GroupMember;
