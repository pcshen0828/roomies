import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SendMessageModal from "../modals/SendMessage";
import { useAuth } from "../../context/AuthContext";
import { Button1, FlexWrapper } from "../common/Components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const defaultCardStyle = `
  width: 100%;
  border-radius: 10px;
  display: flex;
  margin-bottom: 40px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
`;
const MemberBlockWrapper = styled.div`
  ${defaultCardStyle}
  overflow-y: auto;
  height: 400px;
  width: calc(100% - 40px);
  padding: 10px 20px 30px;
  @media screen and (max-width: 995.98px) {
    height: auto;
  }
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
  width: 50px;
  height: 50px;
  margin-right: 10px;
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
  width: 90px;
  height: 35px;
  justify-self: end;
  font-size: 14px;
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
        <SubtitleSmall>・{members.length}人</SubtitleSmall>
      </SubtitlesSmall>
      <MemberBlockWrapper>
        <MembersBlock>
          <MemberBlockCard>
            {members
              .map((user) => user.uid)
              .includes(currentUser && currentUser.uid) && (
              <Member key={currentUser && currentUser.uid}>
                <FlexWrapper>
                  <MemberLink to={`/users/${currentUser && currentUser.uid}`}>
                    <MemberImage
                      src={currentUser && currentUser.profileImage}
                    />
                  </MemberLink>
                  <MemberInfo>
                    <MemberName>{currentUser && currentUser.alias}</MemberName>
                    <MemberJobTitle>
                      {currentUser && currentUser.jobTitle}
                    </MemberJobTitle>
                  </MemberInfo>
                </FlexWrapper>
              </Member>
            )}
            {members
              .filter(
                (member) => member.uid !== (currentUser && currentUser.uid)
              )
              .map((member, index) => (
                <Member key={index}>
                  <FlexWrapper>
                    <MemberLink to={`/users/${member.uid}`}>
                      <MemberImage src={member.profileImage} />
                    </MemberLink>
                    <MemberInfo>
                      <MemberName>{member.alias}</MemberName>
                      <MemberJobTitle>{member.jobTitle}</MemberJobTitle>
                    </MemberInfo>
                  </FlexWrapper>
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
