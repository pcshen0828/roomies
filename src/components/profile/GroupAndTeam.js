import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold, SmallTitle } from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const NewTitle = styled(SmallTitle)`
  margin: 20px 0;
`;

function GroupAndTeam() {
  const { currentUser } = useAuth();
  const [groups, setGroups] = React.useState([]);
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    api
      .getDataWithSingleQuery(
        "groups",
        "members",
        "array-contains",
        currentUser.uid
      )
      .then((res) => {
        const apartmentIds = res.map((item) => item.apartmentId);
        api
          .getDataWithSingleQuery("apartments", "id", "in", apartmentIds)
          .then((res) => {
            setGroups(res);
            console.log(res);
          });
      });
    api
      .getDataWithSingleQuery(
        "teams",
        "userIDs",
        "array-contains",
        currentUser.uid
      )
      .then((res) => {
        setTeams(res);
        console.log(res);
      });
  }, []);

  return (
    <Wrapper>
      <Bold>社團 / 群組管理</Bold>
      <NewTitle>我加入的房源社團 / 群組</NewTitle>
    </Wrapper>
  );
}

export default GroupAndTeam;
