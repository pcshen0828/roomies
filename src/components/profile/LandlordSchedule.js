import React from "react";
import styled from "styled-components";
import { SmallTitle } from "../common/Components";
import Schedule from "./Schedule";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 10px;
`;

function LandlordSchedule() {
  const [events, setEvents] = React.useState([
    {
      title: "event 1",
      start: "2022-04-25T10:30:00",
      end: "2022-04-25T11:30:00",
      extendedProps: { apartment: "123", member: ["a", "b", "c"] },
      backgroundColor: "#c1b18a",
      borderColor: "#c1b18a",
      textColor: "#fff",
    },
    {
      title: "event 2",
      date: "2022-04-24",
      extendedProps: { apartment: "123", member: ["a", "b", "c"] },
      backgroundColor: "#c1b18a",
      borderColor: "#c1b18a",
      textColor: "#fff",
    },
  ]);

  React.useEffect(() => {}, []);

  return (
    <Wrapper>
      <SmallTitle>預約看房行事曆</SmallTitle>
      <Schedule events={events} />
    </Wrapper>
  );
}

export default LandlordSchedule;
