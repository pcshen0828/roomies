import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import TeamCard from "./GroupTeamCard";
import CreateTeam from "./GroupCreateTeam";
import { Firebase } from "../../utils/firebase";
import { FlexColumn, FlexWrapper } from "../common/Components";

const TeamsBlock = styled(FlexColumn)`
  width: 100%;
  height: auto;
`;

const TeamBlockWrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
`;

const TeamBlockCards = styled(FlexWrapper)`
  flex-direction: column;
  width: 100%;
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

function GroupTeam({
  aid,
  members,
  groupId,
  roomies,
  groupMemberDetail,
  isOwner,
  currentUser,
}) {
  const [teams, setTeams] = useState([]);
  const [hasCreated, setHasCreated] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function getTeams() {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "teams"),
        Firebase.where("apartmentID", "==", aid ? aid : ""),
        Firebase.orderBy("createTime", "desc")
      );

      Firebase.onSnapshot(query, (snapshot) => {
        if (!mounted) return;
        setLoading(true);
        const allTeams = snapshot.docs.map((doc) => doc.data());
        setHasCreated(
          allTeams.filter(
            (team) =>
              team.members.find((member) => member.status === 0).uid ===
              currentUser.uid
          ).length
        );
        setLoading(false);
        setTeams(allTeams);
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
        <TitleSmall>已成立隊伍</TitleSmall>
        <SubtitleSmall>・{teams.length}</SubtitleSmall>
      </SubtitlesSmall>
      <TeamBlockWrapper>
        <TeamBlockCards>
          {!isOwner && !hasCreated && !loading && (
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

GroupTeam.propTypes = {
  aid: PropTypes.string,
  members: PropTypes.array,
  groupId: PropTypes.string,
  roomies: PropTypes.number,
  groupMemberDetail: PropTypes.array,
  isOwner: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default GroupTeam;
