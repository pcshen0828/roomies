import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  FlexWrapper,
  Bold,
  SmallTitle,
  CardWrapper,
  ScheduleCard,
  ScheduleDate,
  ScheduleInfo,
  CardTop,
  CardBottom,
} from "../common/Components";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const NewTitle = styled(SmallTitle)`
  margin: 20px 0;
`;

export default function TenantSchedule() {
  const { currentUser } = useAuth();
  const [unConfirmed, setUnconfirmed] = React.useState([]);
  const [schedules, setSchedules] = React.useState([]);

  function generateReadableDate(dateString) {
    const newString = new Date(dateString).toLocaleString().slice(0, -3);
    const index = newString.indexOf("午");
    return newString.slice(index - 1, newString.length);
  }

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "schedules"),
      Firebase.where("members", "array-contains", currentUser.uid),
      Firebase.orderBy("updateTime", "desc")
    );

    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      let newSchedules = [];
      const res = querySnapShot.docs.map((doc) => doc.data());
      res.forEach((schedule) => {
        let newSchedule = {};
        newSchedule.start = schedule.start;
        newSchedule.end = schedule.end;
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
            newSchedule.apartment = { ...res[0] };
          })
          .then(() => {
            api
              .getDataWithSingleQuery("users", "uid", "in", schedule.members)
              .then((res) => {
                newSchedule.members = [...res];
                newSchedules.push(newSchedule);
                setSchedules(
                  newSchedules.filter((schedule) => schedule.status === 1)
                );
                setUnconfirmed(
                  newSchedules.filter((schedule) => schedule.status === 0)
                );
              });
          });
      });
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <Wrapper>
      <Bold>預約看房管理</Bold>
      <NewTitle>已確認行程</NewTitle>
      <CardWrapper>
        {unConfirmed.length
          ? unConfirmed.map((item) => (
              <ScheduleCard key={item.id}>
                <ScheduleDate>
                  <div>{new Date(item.start).getFullYear()}</div>
                  <div>
                    {new Date(item.start).getMonth() + 1} /
                    {new Date(item.start).getDate()}
                  </div>
                  <div>{generateReadableDate(item.start)}</div>
                  <div>{generateReadableDate(item.end)}</div>
                </ScheduleDate>
                <ScheduleInfo>
                  <CardTop>
                    <div>{item.apartment.title}</div>
                  </CardTop>
                  <CardBottom>
                    <div>{item.members.length}人</div>
                  </CardBottom>
                </ScheduleInfo>
              </ScheduleCard>
            ))
          : ""}
      </CardWrapper>
      <NewTitle>待確認行程</NewTitle>
      <CardWrapper>
        {schedules.length
          ? schedules.map((item) => (
              <ScheduleCard key={item.id}>
                <ScheduleDate>
                  <div>{new Date(item.start).getFullYear()}</div>
                  <div>
                    {new Date(item.start).getMonth() + 1} /
                    {new Date(item.start).getDate()}
                  </div>
                  <div>{generateReadableDate(item.start)}</div>
                  <div>{generateReadableDate(item.end)}</div>
                </ScheduleDate>
                <ScheduleInfo>
                  <CardTop>
                    <div>{item.apartment.title}</div>
                  </CardTop>
                  <CardBottom>
                    <div>{item.members.length}人</div>
                  </CardBottom>
                </ScheduleInfo>
              </ScheduleCard>
            ))
          : ""}
      </CardWrapper>
    </Wrapper>
  );
}
