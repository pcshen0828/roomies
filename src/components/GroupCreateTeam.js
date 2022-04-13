import React from "react";
import styled from "styled-components";
import NewTeamModal from "./modals/CreateNewTeam";

const Wrapper = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid #dadada;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  font-size: 80px;
  cursor: pointer;
`;

function CreateTeam({ aid }) {
  const [openNewTeamModal, setOpenNewTeamModal] = React.useState(false);

  return (
    <>
      {openNewTeamModal && (
        <NewTeamModal aid={aid} toggle={setOpenNewTeamModal} />
      )}
      <Wrapper onClick={() => setOpenNewTeamModal(true)}>+</Wrapper>
    </>
  );
}

export default CreateTeam;
