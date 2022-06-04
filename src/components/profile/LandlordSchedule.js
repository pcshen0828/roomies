import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";

import styled from "styled-components";
import { FlexColumn, FlexWrapper, SmallTitle } from "../common/Components";
import Schedule from "./Schedule";
import Requests from "./Requests";

const Wrapper = styled(FlexColumn)`
  width: 100%;
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
  const [events, setEvents] = useState([]);
  const [unConfirmed, setUnconfirmed] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const query = api.createQuery("schedules", "owner", "==", currentUser.uid);
    const unsubscribe = Firebase.onSnapshot(query, (snapshot) => {
      const schedules = snapshot.docs.map((doc) => doc.data());
      let newEvents = [];
      if (schedules.length) {
        schedules.forEach((event) => {
          const apartment = event.apartmentID;
          const members = event.members;
          let newEvent = {};
          newEvent.extendedProps = {};
          api
            .getDataWithSingleQuery("apartments", "id", "==", apartment)
            .then((queriedApartments) => {
              newEvent.title = queriedApartments[0].title;
            })
            .then(() => {
              api
                .getDataWithSingleQuery("users", "uid", "in", members)
                .then((queriedUsers) => {
                  newEvent.extendedProps.members = queriedUsers;
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
                    newEvents.filter(
                      (event) => event.extendedProps.status === 0
                    )
                  );
                  setEvents(
                    newEvents.filter(
                      (event) => event.extendedProps.status === 1
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

  return (
    <Wrapper>
      <TitleWrapper>
        <NewTitle
          active={location.pathname === "/profile/schedule/pending"}
          onClick={() => {
            navigate("/profile/schedule/pending");
          }}
        >
          待回覆的行程
        </NewTitle>
        <NewTitle
          active={location.pathname === "/profile/schedule/booked"}
          onClick={() => {
            navigate("/profile/schedule/booked");
          }}
        >
          {" "}
          預約看房行事曆
        </NewTitle>
      </TitleWrapper>
      {location.pathname === "/profile/schedule/pending" && (
        <Requests
          unConfirmed={unConfirmed}
          user={currentUser}
          loading={loading}
        />
      )}
      {location.pathname === "/profile/schedule/booked" && (
        <Schedule events={events} />
      )}
    </Wrapper>
  );
}

export default LandlordSchedule;
