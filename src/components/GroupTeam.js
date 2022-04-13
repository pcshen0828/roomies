import React from "react";
import styled from "styled-components";

const defaultCardStyle = `
  width: 100%;
  border: 1px solid #c1b18a;
  border-radius: 10px;
  display: flex;
`;

const TeamsBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 68%;
`;

const TeamBlockCard = styled.div`
  ${defaultCardStyle}
  overflow-x: scroll;
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

function GroupTeam() {
  return (
    <TeamsBlock>
      <SubtitlesSmall>
        <TitleSmall>已成立群組</TitleSmall>
        <SubtitleSmall></SubtitleSmall>
      </SubtitlesSmall>
      <TeamBlockCard></TeamBlockCard>
    </TeamsBlock>
  );
}

export default GroupTeam;
