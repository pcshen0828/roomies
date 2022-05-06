import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  FlexWrapper,
  Bold,
  Title,
  SmallTitle,
  CardWrapper,
  ScheduleCard,
  ScheduleDate,
  ScheduleInfo,
  CardTop,
  CardBottom,
  ScheduleInnerWrapper,
} from "../common/Components";
import RequestDetailModal from "../modals/RequestDetail";
import { Link, useNavigate } from "react-router-dom";

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  &:hover {
    color: #c1b18a;
  }
`;

const TitleWrapper = styled(FlexWrapper)`
  border-bottom: 1px solid #dadada;
  margin: 20px 0;
  width: 100%;
`;

const NewTitle = styled(SmallTitle)`
  margin: 0 20px 0 0;
  padding-bottom: 10px;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.active ? "2px solid #424B5A" : "2px solid transparent"};
`;

const DateTitle = styled(Title)`
  margin: 10px 0;
  @media screen and (max-width: 767.98px) {
    font-size: 18px;
    margin: 0 10px 0 0;
  }
`;

const TimeTitle = styled(Bold)`
  padding-bottom: 10px;
`;

const TeamInfoLink = styled.div`
  cursor: pointer;
  margin: 10px 0 0;
  &:hover {
    color: #c1b18a;
  }
`;

export default function TenantSchedule() {
  const { currentUser } = useAuth();
  const [unConfirmed, setUnconfirmed] = React.useState([]);
  const [schedules, setSchedules] = React.useState([]);
  const [finished, setFinished] = React.useState([]);
  const [checkDetail, setCheckDetail] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const navigate = useNavigate();

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
        let newSchedule = {
          start: schedule.start,
          end: schedule.end,
          id: schedule.id,
          status: schedule.status,
          host: schedule.host,
          title: schedule.title,
        };
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
                  newSchedules.filter(
                    (schedule) =>
                      schedule.status === 1 &&
                      new Date(schedule.end).getTime() >= new Date().getTime()
                  )
                );
                setUnconfirmed(
                  newSchedules.filter((schedule) => schedule.status === 0)
                );
                setFinished(
                  newSchedules.filter(
                    (schedule) =>
                      new Date(schedule.end).getTime() < new Date().getTime()
                  )
                );
              });
          });
      });
    });

    return unsubscribe;
  }, [currentUser]);

  function RenderScheduleCard(schedules) {
    return (
      <CardWrapper>
        {schedules.length
          ? schedules.map((item) => (
              <ScheduleCard key={item.id}>
                {checkDetail && (
                  <RequestDetailModal
                    members={item.members}
                    hostId={item.host}
                    toggle={setCheckDetail}
                  />
                )}
                <ScheduleInnerWrapper>
                  <ScheduleDate>
                    <DateTitle>
                      <div>{new Date(item.start).getFullYear()}</div>
                      {new Date(item.start).getMonth() + 1} /
                      {new Date(item.start).getDate()}
                    </DateTitle>
                    <TimeTitle>
                      <div>{generateReadableDate(item.start)}-</div>
                      <div>{generateReadableDate(item.end)}</div>
                    </TimeTitle>
                  </ScheduleDate>
                  <ScheduleInfo>
                    <CardTop>
                      <StyledLink to={`/apartment/${item.apartment.id}`}>
                        <Bold>{item.apartment.title}</Bold>
                      </StyledLink>
                    </CardTop>
                    <CardBottom>
                      <TeamInfoLink onClick={() => setCheckDetail(true)}>
                        {item.members && `${item.members.length}人・查看名單`}
                      </TeamInfoLink>
                    </CardBottom>
                  </ScheduleInfo>
                </ScheduleInnerWrapper>
              </ScheduleCard>
            ))
          : "尚無行程"}
      </CardWrapper>
    );
  }

  return (
    <Wrapper>
      <Bold>預約看房管理</Bold>
      <TitleWrapper>
        <NewTitle
          active={status === 0}
          onClick={() => {
            setStatus(0);
            navigate("/profile/schedule/pending");
          }}
        >
          待確認行程
        </NewTitle>
        <NewTitle
          active={status === 1}
          onClick={() => {
            setStatus(1);
            navigate("/profile/schedule/booked");
          }}
        >
          已確認行程
        </NewTitle>
        <NewTitle
          active={status === 2}
          onClick={() => {
            setStatus(2);
            navigate("/profile/schedule/finished");
          }}
        >
          已結束行程
        </NewTitle>
      </TitleWrapper>
      {status === 0 && RenderScheduleCard(unConfirmed)}
      {status === 1 && RenderScheduleCard(schedules)}
      {status === 2 && RenderScheduleCard(finished)}
    </Wrapper>
  );
}
