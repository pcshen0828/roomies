import React from "react";
import styled from "styled-components";
import { FlexWrapper, SmallTitle, Bold } from "../common/Components";
import Schedule from "./Schedule";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 10px;
`;

const TitleWrapper = styled(FlexWrapper)`
  border-bottom: 1px solid #dadada;
  margin-bottom: 20px;
`;

const NewTitle = styled(SmallTitle)`
  margin: 0 20px 0 0;
  padding-bottom: 10px;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.active ? "2px solid #424B5A" : "2px solid transparent"};
`;

const CardWrapper = styled(FlexWrapper)`
  flex-wrap: wrap;
`;

const ScheduleCard = styled(FlexWrapper)`
  width: 350px;
  height: 200px;
  border-radius: 10px;
  border: 1px solid #dadada;
  margin: 0 20px 20px 0;
  cursor: pointer;
  padding: 20px;
`;

const ScheduleDate = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
`;

const ScheduleInfo = styled(FlexWrapper)`
  flex-direction: column;
  width: 60%;
  align-items: flex-start;
`;

const CardTop = styled(FlexWrapper)`
  flex-direction: column;
  height: 40%;
  border-bottom: 1px solid #dadada;
`;

const CardBottom = styled(FlexWrapper)`
  height: 60%;
  align-items: flex-start;
  flex-direction: column;
`;

function LandlordSchedule() {
  const { currentUser } = useAuth();
  const [page, setPage] = React.useState("request");
  const [events, setEvents] = React.useState([]);
  const [unConfirmed, setUnconfirmed] = React.useState([]);

  function generateReadableDate(dateString) {
    return new Date(dateString).toLocaleString().slice(0, -3);
  }

  React.useEffect(() => {
    const query = api.createQuery("schedules", "owner", "==", currentUser.uid);
    Firebase.onSnapshot(query, (snapshot) => {
      const res = snapshot.docs.map((doc) => doc.data());
      let newEvents = [];
      res.forEach((event) => {
        const apartment = event.apartmentID;
        const members = event.members;
        let newEvent = {};
        newEvent.extendedProps = {};
        api
          .getDataWithSingleQuery("apartments", "id", "==", apartment)
          .then((res) => {
            newEvent.title = res[0].title;
          });
        api
          .getDataWithSingleQuery("users", "uid", "in", members)
          .then((res) => {
            newEvent.extendedProps.members = res;
          });
        newEvent.extendedProps.id = event.id;
        newEvent.extendedProps.status = event.status;
        newEvent.start = event.start;
        newEvent.end = event.end;
        newEvent.backgroundColor = "#c1b18a";
        newEvent.borderColor = "#c1b18a";
        newEvent.textColor = "#fff";
        console.log(newEvent);

        newEvents.push(newEvent);
      });

      setUnconfirmed(
        newEvents.filter((event) => event.extendedProps.status === 0)
      );
      setEvents(newEvents.filter((event) => event.extendedProps.status === 1));
    });
  }, [currentUser]);

  return (
    <Wrapper>
      <TitleWrapper>
        <NewTitle
          active={page === "request"}
          onClick={() => setPage("request")}
        >
          待回覆的行程
        </NewTitle>
        <NewTitle
          active={page === "calendar"}
          onClick={() => setPage("calendar")}
        >
          {" "}
          預約看房行事曆
        </NewTitle>
      </TitleWrapper>
      {/* {page === "request" && ( */}
      <CardWrapper>
        {unConfirmed.map((request) => {
          console.log("start");
          console.log(request);
          return (
            <ScheduleCard key={request.extendedProps.id}>
              <ScheduleDate>
                <div>{new Date(request.start).getFullYear()}</div>
                <div>
                  {new Date(request.start).getMonth() + 1} /
                  {new Date(request.start).getDate()}
                </div>
                <div>
                  {new Date(request.start).getHours()}:
                  {new Date(request.end).getMinutes() === 0
                    ? "00"
                    : new Date(request.end).getMinutes() <= 10
                    ? `0${new Date(request.end).getMinutes()}`
                    : new Date(request.end).getMinutes()}
                  -{new Date(request.end).getHours()}:
                  {new Date(request.end).getMinutes() === 0
                    ? "00"
                    : new Date(request.end).getMinutes() <= 10
                    ? `0${new Date(request.end).getMinutes()}`
                    : new Date(request.end).getMinutes()}
                </div>
                {/* <div>{generateReadableDate(request.end)}</div> */}
              </ScheduleDate>
              <ScheduleInfo>
                <CardTop>
                  <Bold>{request.title}</Bold>
                </CardTop>
                <CardBottom>
                  {request.extendedProps.members &&
                    `${request.extendedProps.members.length}人`}
                </CardBottom>
              </ScheduleInfo>
            </ScheduleCard>
          );
        })}
      </CardWrapper>
      {/* )} */}
      <Schedule events={events} />
      {page === "calendar" && <Schedule events={events} />}
    </Wrapper>
  );
}

export default LandlordSchedule;
