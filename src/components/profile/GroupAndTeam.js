import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold, SmallTitle } from "../common/Components";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import ManageTeamModal from "../modals/ManageTeam";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const NewTitle = styled(SmallTitle)`
  margin: 20px 0;
`;

const FlexTableWrapper = styled(FlexWrapper)`
  width: 100%;
  align-items: flex-start;
  flex-direction: column;
  border: 1px solid #dadada;
`;

const FlexRowWrapper = styled(FlexWrapper)`
  width: 100%;
  align-items: flex-start;
  border-bottom: ${(props) => (props.last ? "none" : "1px solid #dadada")};
`;

const defaultStyled = `
  padding: 0 0 5px 5px;
  border-right: 1px solid #dadada;
  margin-bottom: 0;
  `;

const TableHead = styled(SmallTitle)`
  ${defaultStyled};
  width: ${(props) => (props.no ? "80px" : "calc((100% - 80px) / 2)")};
  border-right: ${(props) => (props.last ? "none" : "1px solid #dadada")};
`;

const BodyColumn = styled(FlexWrapper)`
  ${defaultStyled};
  height: 100px;
  overflow-y: scroll;
  width: ${(props) => (props.no ? "80px" : "calc((100% - 80px) / 2)")};
  border-right: ${(props) => (props.last ? "none" : "1px solid #dadada")};
  flex-wrap: ${(props) => (props.last ? "wrap" : "no-wrap")};
`;

const NewLink = styled(Link)`
  color: #424b5a;
  &:hover {
    text-decoration: underline;
  }
`;

const TeamLink = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  margin: 10px 10px 10px 0;
  border: 1px solid #c1b18a;
  cursor: pointer;
  &:hover {
    background: #c1b18a;
    color: #fff;
  }
`;

function GroupAndTeam() {
  const { currentUser } = useAuth();
  const [groups, setGroups] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [teamId, setTeamId] = React.useState("");

  React.useEffect(() => {
    const query1 = api.createQuery(
      "groups",
      "members",
      "array-contains",
      currentUser.uid
    );
    const unsubscribe1 = Firebase.onSnapshot(query1, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      const apartmentIds = res.map((item) => item.apartmentId);
      api
        .getDataWithSingleQuery("apartments", "id", "in", apartmentIds)
        .then((res) => {
          setGroups(res);
          console.log(res);
        });
    });

    const query2 = api.createQuery(
      "teams",
      "userIDs",
      "array-contains",
      currentUser.uid
    );

    const unsubscribe2 = Firebase.onSnapshot(query2, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      setTeams(res);
      console.log(res);
    });
    // api
    //   .getDataWithSingleQuery(
    //     "groups",
    //     "members",
    //     "array-contains",
    //     currentUser.uid
    //   )
    //   .then((res) => {
    //     const apartmentIds = res.map((item) => item.apartmentId);
    //     api
    //       .getDataWithSingleQuery("apartments", "id", "in", apartmentIds)
    //       .then((res) => {
    //         setGroups(res);
    //         console.log(res);
    //       });
    //   });
    // api
    //   .getDataWithSingleQuery(
    // "teams",
    // "userIDs",
    // "array-contains",
    // currentUser.uid
    //   )
    //   .then((res) => {
    //     setTeams(res);
    //     console.log(res);
    //   });

    return function cleanup() {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return (
    <Wrapper>
      <Bold>社團 / 群組管理</Bold>
      <NewTitle>我加入的房源社團 / 群組</NewTitle>
      <FlexTableWrapper>
        <FlexRowWrapper>
          <TableHead no>編號</TableHead>
          <TableHead>房源社團</TableHead>
          <TableHead last>租房群組</TableHead>
        </FlexRowWrapper>
        {groups.map((group, index) => (
          <FlexRowWrapper
            body
            key={group.id}
            last={index + 1 === groups.length}
          >
            <BodyColumn no>{index + 1}</BodyColumn>
            <BodyColumn>
              <NewLink to={`/apartment/${group.id}`}>{group.title}</NewLink>
            </BodyColumn>
            <BodyColumn last>
              {teams
                .filter((team) => team.apartmentID === group.id)
                .map((team) => (
                  <React.Fragment key={team.id}>
                    <TeamLink onClick={() => setTeamId(team.id)}>
                      {team.name}
                    </TeamLink>
                    {teamId === team.id && (
                      <ManageTeamModal
                        team={team}
                        group={group}
                        toggle={setTeamId}
                      />
                    )}
                  </React.Fragment>
                ))}
            </BodyColumn>
          </FlexRowWrapper>
        ))}
      </FlexTableWrapper>
    </Wrapper>
  );
}

export default GroupAndTeam;
