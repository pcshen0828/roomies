import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
} from "./ModalElements";
import { Button1 } from "../common/Components";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const NewBody = styled(Body)`
  height: 400px;
`;

const Members = styled.div`
  display: flex;
  flex-direction: column;
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 10px 20px;
  justify-content: space-between;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MemberLink = styled(Link)``;

const MemberImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.div`
  font-weight: 700;
`;

const MemberStatus = styled.div`
  width: 100px;
  height: 35px;
  border: 1px solid #dadada;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
`;

const ActionButton = styled(Button1)`
  width: 90px;
  height: 35px;
  margin-right: 10px;
`;

function CheckTeamMembersModal({ toggle, members, teamId }) {
  const { currentUser } = useAuth();
  const [teamMembers, setTeamMembers] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function getTeamsMembers() {
      if (!mounted) return;
      api
        .getDataWithSingleQuery(
          "users",
          "uid",
          "in",
          members.map((member) => member.uid)
        )
        .then((res) => setTeamMembers(res));
    }
    getTeamsMembers();
    return function cleanup() {
      mounted = false;
    };
  }, []);

  function checkMemberStatus(id, statusCode) {
    return members.find((member) => member.uid === id).status === statusCode;
  }
  const condition = members.find((member) => member.uid === currentUser.uid);
  const checkUserInTeamStatus = condition ? condition.status : "";

  function addToTeam(id) {
    members.find((member) => member.uid === id).status = 1;
    api.updateDocData("teams", teamId, {
      members,
    });
  }

  return (
    <Overlay out={false}>
      <Modal>
        <Header>
          <Title>群組成員</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <Members>
            {teamMembers.length
              ? teamMembers.map((teamMember, index) => (
                  <Member key={index}>
                    <FlexWrapper>
                      <MemberLink to={`/users/${teamMember.uid}`}>
                        <MemberImage src={teamMember.profileImage} />
                      </MemberLink>
                      <MemberInfo>
                        <MemberName>{teamMember.alias}</MemberName>
                        <>{teamMember.jobTitle}</>
                      </MemberInfo>
                    </FlexWrapper>
                    <FlexWrapper>
                      {checkUserInTeamStatus === 0 &&
                      checkMemberStatus(teamMember.uid, 3) ? (
                        <ActionButton onClick={() => addToTeam(teamMember.uid)}>
                          核准
                        </ActionButton>
                      ) : checkUserInTeamStatus === 2 &&
                        checkMemberStatus(teamMember.uid, 2) ? (
                        <ActionButton onClick={() => addToTeam(teamMember.uid)}>
                          加入
                        </ActionButton>
                      ) : (
                        ""
                      )}
                      <MemberStatus>
                        {checkMemberStatus(teamMember.uid, 0)
                          ? "團主"
                          : checkMemberStatus(teamMember.uid, 1)
                          ? "成員"
                          : checkMemberStatus(teamMember.uid, 2)
                          ? "邀請中"
                          : checkMemberStatus(teamMember.uid, 3)
                          ? "待核准"
                          : ""}
                      </MemberStatus>
                    </FlexWrapper>
                  </Member>
                ))
              : "loading..."}
          </Members>
        </NewBody>
      </Modal>
    </Overlay>
  );
}

export default CheckTeamMembersModal;
