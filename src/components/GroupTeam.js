import React from "react";
import styled from "styled-components";
import TeamCard from "./GroupTeamCard";
import CreateTeam from "./GroupCreateTeam";
import { Firebase } from "../utils/firebase";

const TeamsBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const defaultCardStyle = `
  border: 1px solid #c1b18a;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

const TeamBlockWrapper = styled.div`
  ${defaultCardStyle}
  width: 100%;
  overflow-x: scroll;
  height: 300px;
`;

const TeamBlockCards = styled.div`
  display: flex;
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

function GroupTeam({ aid }) {
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function getTeams() {
      if (!mounted) return;
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "teams"),
        Firebase.where("apartmentID", "==", aid ? aid : "")
      );

      Firebase.onSnapshot(query, (snapshot) => {
        setTeams(snapshot.docs.map((doc) => doc.data()));
      });
    }
    getTeams();

    return function cleanup() {
      mounted = false;
    };
  }, [aid]);

  return (
    <TeamsBlock>
      <SubtitlesSmall>
        <TitleSmall>已成立群組</TitleSmall>
        <SubtitleSmall></SubtitleSmall>
      </SubtitlesSmall>
      <TeamBlockWrapper>
        <TeamBlockCards>
          <CreateTeam aid={aid} />
          {teams.length
            ? teams.map((team, index) => <TeamCard key={index} team={team} />)
            : "loading..."}
        </TeamBlockCards>
      </TeamBlockWrapper>
    </TeamsBlock>
  );
}

export default GroupTeam;
