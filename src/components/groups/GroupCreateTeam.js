import React from "react";
import styled from "styled-components";
import { subColor } from "../../styles/GlobalStyle";
import { FlexWrapper } from "../common/Components";
import NewTeamModal from "../modals/CreateNewTeam";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

const Wrapper = styled(FlexWrapper)`
  width: 99.5%;
  height: 150px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 80px;
  cursor: pointer;
  &:hover {
    color: ${subColor};
  }
  @media screen and (max-width: 995.98px) {
    height: 100px;
    font-size: 60px;
  }
`;

function CreateTeam({ aid, members, groupId, groupMemberDetail }) {
  const [openNewTeamModal, setOpenNewTeamModal] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <>
      {saved && (
        <SuccessfullySavedModal message="建立成功！" toggle={setSaved} />
      )}
      {openNewTeamModal && (
        <NewTeamModal
          aid={aid}
          toggle={setOpenNewTeamModal}
          members={members}
          groupId={groupId}
          groupMemberDetail={groupMemberDetail}
          setSaved={setSaved}
        />
      )}
      <Wrapper title="組隊租屋" onClick={() => setOpenNewTeamModal(true)}>
        +
      </Wrapper>
    </>
  );
}

export default CreateTeam;
