import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import styled from "styled-components";
import {
  Button1,
  FlexColumn,
  FlexWrapper,
  SlicedBold,
} from "../common/Components";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import SendMessageModal from "../modals/SendMessage";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  margin-top: 20px;
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

const MembersBlock = styled(FlexColumn)`
  width: 100%;
  align-items: stretch;
`;

const MemberBlockCard = styled.div`
  flex-direction: column;
`;

const Member = styled(FlexWrapper)`
  justify-content: space-between;
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

const MemberInfo = styled(FlexColumn)``;

const MemberName = styled(SlicedBold)`
  max-width: 120px;
  @media screen and (max-width: 413.98px) {
    max-width: 60px;
  }
`;

const MemberJobTitle = styled(SlicedBold)`
  max-width: 120px;
  @media screen and (max-width: 413.98px) {
    max-width: 80px;
  }
  font-size: 14px;
  font-weight: 400;
`;

const MessageButton = styled(Button1)`
  width: 90px;
  height: 35px;
  justify-self: end;
  font-size: 14px;
`;

const SubtitlesSmall = styled(FlexWrapper)`
  margin-bottom: 10px;
`;

const TitleSmall = styled.div`
  font-weight: 700;
`;

const SubtitleSmall = styled.div`
  font-size: 14px;
  color: #a1aeb7;
  font-weight: 700;
`;

function GroupMember({ members }) {
  const [openModal, setOpenModal] = useState(false);
  const [objectId, setObjectId] = useState("");
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <Wrapper>
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="??????????????????" />
      )}
      {openModal && (
        <SendMessageModal
          toggle={() => setOpenModal(false)}
          objectId={objectId}
          successfullySaved={() => setSaved(true)}
          receiver="otherUser"
        />
      )}
      {members.length ? (
        <>
          <SubtitlesSmall>
            <TitleSmall>??????</TitleSmall>
            <SubtitleSmall>???{members.length}???</SubtitleSmall>
          </SubtitlesSmall>
          <MemberBlockWrapper>
            <MembersBlock>
              <MemberBlockCard>
                {members
                  .map((user) => user.uid)
                  .includes(currentUser && currentUser.uid) && (
                  <Member key={currentUser && currentUser.uid}>
                    <FlexWrapper>
                      <MemberLink
                        to={`/users/${currentUser && currentUser.uid}`}
                      >
                        <MemberImage
                          src={currentUser && currentUser.profileImage}
                        />
                      </MemberLink>
                      <MemberInfo>
                        <MemberName>
                          {currentUser && currentUser.alias}
                        </MemberName>
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
                        ????????????
                      </MessageButton>
                    </Member>
                  ))}
              </MemberBlockCard>
            </MembersBlock>
          </MemberBlockWrapper>
        </>
      ) : (
        ""
      )}
    </Wrapper>
  );
}

GroupMember.propTypes = {
  members: PropTypes.array,
};

export default GroupMember;
