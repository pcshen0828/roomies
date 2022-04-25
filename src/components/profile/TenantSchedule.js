import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { FlexWrapper, Bold, SmallTitle } from "../common/Components";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const NewTitle = styled(SmallTitle)`
  margin: 20px 0;
`;

const ScheduleCard = styled(FlexWrapper)`
  flex-direction: column;
  width: 250px;
  height: 200px;
  border-radius: 10px;
  border: 1px solid #dadada;
`;

const CardTop = styled(FlexWrapper)`
  height: 50%;
  border-bottom: 1px solid #dadada;
`;

const CardBottom = styled(FlexWrapper)`
  height: 50%;
`;

export default function TenantSchedule() {
  const { currentUser } = useAuth();
  const [schedules, setSchedules] = React.useState([]);

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "schedules"),
      Firebase.where("members", "array-contains", currentUser.uid),
      Firebase.orderBy("updateTime", "desc")
    );

    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      const res = querySnapShot.docs.map((doc) => doc.data());
      let newSchedules = [];
      setSchedules(res);
      res.forEach((schedule) => {
        let newSchedule = {};
        newSchedule.start = new Date(schedule.start)
          .toLocaleString()
          .slice(0, -3);
        newSchedule.end = new Date(schedule.end).toLocaleString().slice(0, -3);
        newSchedule.status = schedule.status;
        newSchedule.id = schedule.id;
        api
          .getDataWithSingleQuery(
            "apartments",
            "id",
            "==",
            schedule.apartmentID
          )
          .then((res) => {
            newSchedule.apartment = res[0];
          });
        api
          .getDataWithSingleQuery("users", "uid", "in", schedule.members)
          .then((res) => {
            newSchedule.members = res;
          });
        newSchedules.push(newSchedule);
      });
      console.log(newSchedules);
      // setSchedules(newSchedules);
    });

    return function cleanup() {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <Wrapper>
      <Bold>預約看房管理</Bold>
      <NewTitle>已確認行程</NewTitle>
      <FlexWrapper>
        {schedules.length
          ? schedules
              .filter((schedule) => schedule.status === 1)
              .map((item) => <ScheduleCard key={item.id}>123</ScheduleCard>)
          : ""}
      </FlexWrapper>
      <NewTitle>待確認行程</NewTitle>
      <FlexWrapper>
        {schedules.length
          ? schedules
              .filter((schedule) => schedule.status === 0)
              .map((item) => (
                <ScheduleCard key={item.id}>
                  <CardTop>
                    <Bold>{item.apartmentID}</Bold>
                  </CardTop>
                  <CardBottom>
                    <Bold>
                      {new Date(item.start).toLocaleString().slice(0, -3)}
                    </Bold>
                  </CardBottom>
                </ScheduleCard>
              ))
          : ""}
      </FlexWrapper>
    </Wrapper>
  );
}
