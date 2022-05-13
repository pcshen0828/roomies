import React from "react";
import styled from "styled-components";
import TeamCard from "./GroupTeamCard";
import CreateTeam from "./GroupCreateTeam";
import { Firebase } from "../../utils/firebase";
import { FlexWrapper } from "../common/Components";

const TeamsBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TeamBlockWrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  overflow-y: auto;
  ${
    "" /* @media screen and (max-width: 995.98px) {
    height: auto;
  } */
  }
`;

const TeamBlockCards = styled(FlexWrapper)`
  flex-direction: column;
  width: 100%;
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

function GroupTeam({
  aid,
  members,
  groupId,
  roomies,
  groupMemberDetail,
  isOwner,
}) {
  const [teams, setTeams] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    async function getTeams() {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "teams"),
        Firebase.where("apartmentID", "==", aid ? aid : ""),
        Firebase.orderBy("createTime", "desc")
      );

      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
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
        <SubtitleSmall>・{teams.length}</SubtitleSmall>
      </SubtitlesSmall>
      <TeamBlockWrapper>
        <TeamBlockCards>
          {isOwner ? (
            ""
          ) : (
            <CreateTeam
              aid={aid}
              members={members}
              groupId={groupId}
              groupMemberDetail={groupMemberDetail}
            />
          )}
          {teams.length
            ? teams.map((team, index) => (
                <TeamCard
                  key={index}
                  team={team}
                  roomies={roomies}
                  groupMemberDetail={groupMemberDetail}
                  isOwner={isOwner}
                />
              ))
            : ""}
        </TeamBlockCards>
      </TeamBlockWrapper>
    </TeamsBlock>
  );
}

export default GroupTeam;
