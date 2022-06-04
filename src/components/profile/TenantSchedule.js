import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import {
  FlexWrapper,
  Bold,
  SmallTitle,
  CardWrapper,
  ScheduleCard,
  ScheduleDate,
  DateTitle,
  TimeTitle,
  ScheduleInfo,
  CardTop,
  CardBottom,
  ScheduleInnerWrapper,
  ScheduleTitle,
} from "../common/Components";
import RequestDetailModal from "../modals/RequestDetail";
import Skeleton from "react-loading-skeleton";

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

const TeamInfoLink = styled.div`
  cursor: pointer;
  margin: 10px 0 0;
  &:hover {
    color: #c1b18a;
  }
`;

export default function TenantSchedule() {
  const { currentUser } = useAuth();
  const [unConfirmed, setUnconfirmed] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [finished, setFinished] = useState([]);
  const [checkDetail, setCheckDetail] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  function generateReadableDate(dateString) {
    const newString = new Date(dateString).toLocaleString().slice(0, -3);
    const index = newString.indexOf("午");
    return newString.slice(index - 1, newString.length);
  }

  useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "schedules"),
      Firebase.where("members", "array-contains", currentUser.uid),
      Firebase.orderBy("updateTime", "desc")
    );

    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      let newSchedules = [];
      const schedules = querySnapShot.docs.map((doc) => doc.data());
      if (schedules.length) {
        schedules.forEach((schedule) => {
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
            .then((queriedApartments) => {
              newSchedule.apartment = queriedApartments[0];
            })
            .then(() => {
              api
                .getDataWithSingleQuery("users", "uid", "in", schedule.members)
                .then((queriedUsers) => {
                  newSchedule.members = queriedUsers;
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
                  setLoading(false);
                });
            });
        });
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [currentUser]);

  function generateSkeletons(width, height, margin) {
    return Array.from(Array(2).keys()).map((loader, index) => (
      <Skeleton
        key={index}
        width={width}
        height={height}
        borderRadius={10}
        style={{ margin }}
      />
    ));
  }

  function RenderScheduleCard(schedules) {
    return (
      <CardWrapper>
        {loading
          ? matchMedia("(max-width: 414px)").matches
            ? generateSkeletons(200, 200, "0 0 20px")
            : matchMedia("(max-width: 767.98px)").matches
            ? generateSkeletons(300, 250, "0 0 20px")
            : generateSkeletons(360, 220, "0 20px 20px 0")
          : schedules.length
          ? schedules.map((item) => (
              <ScheduleCard key={item.id} src={item.apartment.coverImage}>
                {checkDetail && (
                  <RequestDetailModal
                    members={item.members}
                    hostId={item.host}
                    toggle={() => setCheckDetail(false)}
                  />
                )}
                <ScheduleInnerWrapper>
                  <ScheduleDate>
                    <DateTitle>
                      {new Date(item.start).getFullYear() !==
                        new Date().getFullYear() &&
                        new Date(item.start).getFullYear()}
                      {new Date(item.start).getMonth() + 1} /
                      {new Date(item.start).getDate()}
                    </DateTitle>
                    <TimeTitle>
                      {generateReadableDate(item.start)}-
                      {generateReadableDate(item.end)}
                    </TimeTitle>
                  </ScheduleDate>
                  <ScheduleInfo>
                    <CardTop>
                      <StyledLink to={`/apartment/${item.apartment.id}`}>
                        <ScheduleTitle>{item.apartment.title}</ScheduleTitle>
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
          active={location.pathname === "/profile/schedule/pending"}
          onClick={() => {
            navigate("/profile/schedule/pending");
          }}
        >
          待確認行程
        </NewTitle>
        <NewTitle
          active={location.pathname === "/profile/schedule/booked"}
          onClick={() => {
            navigate("/profile/schedule/booked");
          }}
        >
          已確認行程
        </NewTitle>
        <NewTitle
          active={location.pathname === "/profile/schedule/finished"}
          onClick={() => {
            navigate("/profile/schedule/finished");
          }}
        >
          已結束行程
        </NewTitle>
      </TitleWrapper>
      {location.pathname === "/profile/schedule/pending" &&
        RenderScheduleCard(unConfirmed)}
      {location.pathname === "/profile/schedule/booked" &&
        RenderScheduleCard(schedules)}
      {location.pathname === "/profile/schedule/finished" &&
        RenderScheduleCard(finished)}
    </Wrapper>
  );
}
