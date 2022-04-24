import React from "react";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import zhTwLocale from "@fullcalendar/core/locales/zh-tw";
import "./customCalendar.css";
import { NavModal, CloseButton } from "../modals/ModalElements";

const CalendarWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`;

const EventInfoWindow = styled(NavModal)`
  z-index: 10;
`;

const Close = styled(CloseButton)`
  align-self: end;
`;

function Schedule({ events }) {
  const [eventInfo, setEventInfo] = React.useState({});
  const [coordinates, setCoordinates] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);

  function showEventModal(info) {
    setEventInfo(info.event);
    setCoordinates({
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    });
    console.log(info.event.extendedProps);
    console.log("Event: " + info.event.title);
    setShowModal(true);
  }

  return (
    <CalendarWrapper>
      {showModal && (
        <EventInfoWindow
          style={{ top: `${coordinates.y}px`, left: `${coordinates.x}px` }}
        >
          <Close onClick={() => setShowModal(false)}>×</Close>
          {eventInfo.title}
          {eventInfo.extendedProps.apartment}
        </EventInfoWindow>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        }}
        locale={zhTwLocale}
        events={events}
        eventClick={(info) => showEventModal(info)}
        dateClick={(info) => {}}
      />
    </CalendarWrapper>
  );
}

export default Schedule;
