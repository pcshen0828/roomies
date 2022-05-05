import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../common/Components";
import NewTeamModal from "../modals/CreateNewTeam";

const Wrapper = styled(FlexWrapper)`
  width: 99.5%;
  height: 150px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 80px;
  cursor: pointer;
  border: 0.5px solid rgba(0, 0, 0, 0.03);
  &:hover {
    background: #e8e8e8;
  }
  @media screen and (max-width: 995.98px) {
    height: 100px;
    font-size: 60px;
  }
`;

function CreateTeam({ aid, members, groupId, groupMemberDetail }) {
  const [openNewTeamModal, setOpenNewTeamModal] = React.useState(false);

  return (
    <>
      {openNewTeamModal && (
        <NewTeamModal
          aid={aid}
          toggle={setOpenNewTeamModal}
          members={members}
          groupId={groupId}
          groupMemberDetail={groupMemberDetail}
        />
      )}
      <Wrapper title="建立群組" onClick={() => setOpenNewTeamModal(true)}>
        +
      </Wrapper>
    </>
  );
}

export default CreateTeam;
