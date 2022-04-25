import React from "react";
import {
  Bold,
  CardWrapper,
  ScheduleCard,
  ScheduleDate,
  ScheduleInfo,
  CardTop,
  CardBottom,
} from "../common/Components";

// const CardWrapper = styled(FlexWrapper)`
//   flex-wrap: wrap;
// `;

// const ScheduleCard = styled(FlexWrapper)`
//   width: 350px;
//   height: 200px;
//   border-radius: 10px;
//   border: 1px solid #dadada;
//   margin: 0 20px 20px 0;
//   cursor: pointer;
//   padding: 20px;
// `;

// const ScheduleDate = styled(FlexWrapper)`
//   flex-direction: column;
//   align-items: flex-start;
//   width: 40%;
// `;

// const ScheduleInfo = styled(FlexWrapper)`
//   flex-direction: column;
//   width: 60%;
//   align-items: flex-start;
// `;

// const CardTop = styled(FlexWrapper)`
//   flex-direction: column;
//   height: 40%;
//   border-bottom: 1px solid #dadada;
// `;

// const CardBottom = styled(FlexWrapper)`
//   height: 60%;
//   align-items: flex-start;
//   flex-direction: column;
// `;

export default function Requests({ unConfirmed }) {
  function generateReadableDate(dateString) {
    const newString = new Date(dateString).toLocaleString().slice(0, -3);
    const index = newString.indexOf("午");
    return newString.slice(index - 1, newString.length);
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
              </CardBottom>
            </ScheduleInfo>
          </ScheduleCard>
        ))}
    </CardWrapper>
  );
}
