import React from "react";
import {
  Bold,
  CardWrapper,
  ScheduleCard,
  ScheduleDate,
  ScheduleInfo,
  CardTop,
  CardBottom,
  Button1,
} from "../common/Components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";

export default function Requests({ unConfirmed }) {
  function generateReadableDate(dateString) {
    const newString = new Date(dateString).toLocaleString().slice(0, -3);
    const index = newString.indexOf("午");
    return newString.slice(index - 1, newString.length);
  }

  function confirmSchedule(id) {
    const time = Firebase.Timestamp.fromDate(new Date());
    api.updateDocData("schedules", id, {
      updateTime: time,
      status: 1,
    });
  }

  return (
    <CardWrapper>
      {unConfirmed &&
        unConfirmed.map((request) => (
          <ScheduleCard key={request.extendedProps.id}>
            <ScheduleDate>
              <div>{new Date(request.start).getFullYear()}</div>
              <div>
                {new Date(request.start).getMonth() + 1} /
                {new Date(request.start).getDate()}
              </div>
              <div>{generateReadableDate(request.start)}</div>
              <div>{generateReadableDate(request.end)}</div>
            </ScheduleDate>
            <ScheduleInfo>
              <CardTop>
                <Bold>{request.title}</Bold>
              </CardTop>
              <CardBottom>
                {request.extendedProps.members &&
                  `${request.extendedProps.members.length}人`}
                <Button1
                  onClick={() => {
                    confirmSchedule(request.extendedProps.id);
                  }}
                >
                  確認
                </Button1>
              </CardBottom>
            </ScheduleInfo>
          </ScheduleCard>
        ))}
    </CardWrapper>
  );
}
