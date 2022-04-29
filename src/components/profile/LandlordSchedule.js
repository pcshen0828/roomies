import React from "react";
import styled from "styled-components";
import { FlexWrapper, SmallTitle } from "../common/Components";
import Schedule from "./Schedule";
import Requests from "./Requests";
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

function LandlordSchedule() {
  const { currentUser } = useAuth();
  const [page, setPage] = React.useState("request");
  const [events, setEvents] = React.useState([]);
  const [unConfirmed, setUnconfirmed] = React.useState([]);

  React.useEffect(() => {
    const query = api.createQuery("schedules", "owner", "==", currentUser.uid);
    const unsubscribe = Firebase.onSnapshot(query, (snapshot) => {
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
          })
          .then(() => {
            api
              .getDataWithSingleQuery("users", "uid", "in", members)
              .then((res) => {
                newEvent.extendedProps.members = res;
              })
              .then(() => {
                newEvent.extendedProps.id = event.id;
                newEvent.extendedProps.host = event.host;
                newEvent.extendedProps.status = event.status;
                newEvent.start = event.start;
                newEvent.end = event.end;
                newEvent.backgroundColor = "#c1b18a";
                newEvent.borderColor = "#c1b18a";
                newEvent.textColor = "#fff";

                newEvents.push(newEvent);
                setUnconfirmed(
                  newEvents.filter((event) => event.extendedProps.status === 0)
                );
                setEvents(
                  newEvents.filter((event) => event.extendedProps.status === 1)
                );
              });
          });
      });
    });

    return unsubscribe;
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
      {page === "request" && (
        <Requests unConfirmed={unConfirmed} user={currentUser} />
      )}
      {page === "calendar" && <Schedule events={events} />}
    </Wrapper>
  );
}

export default LandlordSchedule;
