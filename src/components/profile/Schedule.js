import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EventInfoWindowModal from "./EventInfoWindow";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import zhTwLocale from "@fullcalendar/core/locales/zh-tw";

const CalendarWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`;

function Schedule({ events }) {
  const [eventInfo, setEventInfo] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [showModal, setShowModal] = useState(false);

  function showEventModal(info) {
    setEventInfo(info.event);
    setCoordinates({
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    });
    setShowModal(true);
  }

  return (
    <CalendarWrapper>
      {showModal && (
        <EventInfoWindowModal
          coordinates={coordinates}
          eventInfo={eventInfo}
          toggle={() => setShowModal(false)}
        />
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
      />
    </CalendarWrapper>
  );
}

Schedule.propTypes = {
  events: PropTypes.array.isRequired,
};

export default Schedule;
