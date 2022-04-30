import React from "react";
import styled from "styled-components";
import {
  Bold,
  Title,
  CardWrapper,
  ScheduleCard,
  ScheduleInnerWrapper,
  ScheduleDate,
  ScheduleInfo,
  CardTop,
  CardBottom,
  FlexWrapper,
} from "../common/Components";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import check from "../../images/check.svg";
import cancel from "../../images/cancel.svg";
import RequestDetailModal from "../modals/RequestDetail";
import PopupNoticeModal from "../modals/PopupNotice";

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

const ActionBlock = styled(FlexWrapper)`
  margin-top: 20px;
`;

const ActionButton = styled(FlexWrapper)`
  margin-right: 20px;
  cursor: pointer;
  &:hover {
    font-weight: 700;
  }
`;

const ActionImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

export default function Requests({ unConfirmed, user }) {
  const [checkDetail, setCheckDetail] = React.useState(false);
  const [popup, setPopup] = React.useState(false);

  function generateReadableDate(dateString) {
    const newString = new Date(dateString).toLocaleString().slice(0, -3);
    const index = newString.indexOf("午");
    return newString.slice(index - 1, newString.length);
  }

  function confirmSchedule(id, host) {
    const time = Firebase.Timestamp.fromDate(new Date());

    api.updateDocData("schedules", id, {
      updateTime: time,
      status: 1,
    });
    api.createNoticeByType(user.uid, host, 2);
    setPopup(true);
  }

  function rejectSchedule(id, host) {
    const time = Firebase.Timestamp.fromDate(new Date());

    api.updateDocData("schedules", id, {
      updateTime: time,
      status: 2,
    });
    api.createNoticeByType(user.uid, host, 7);
  }

  return (
    <CardWrapper>
      {unConfirmed.length
        ? unConfirmed.map((request) => (
            <ScheduleCard key={request.extendedProps.id}>
              {checkDetail && (
                <RequestDetailModal
                  members={request.extendedProps.members}
                  hostId={request.extendedProps.host}
                  toggle={setCheckDetail}
                />
              )}
              <ScheduleInnerWrapper>
                <ScheduleDate>
                  <DateTitle>
                    <div>{new Date(request.start).getFullYear()}</div>
                    {new Date(request.start).getMonth() + 1} /
                    {new Date(request.start).getDate()}
                  </DateTitle>
                  <TimeTitle>
                    <div>{generateReadableDate(request.start)}-</div>
                    <div>{generateReadableDate(request.end)}</div>
                  </TimeTitle>
                </ScheduleDate>
                <ScheduleInfo>
                  <CardTop>
                    <Bold>{request.title}</Bold>
                  </CardTop>
                  <CardBottom>
                    <TeamInfoLink onClick={() => setCheckDetail(true)}>
                      {request.extendedProps.members &&
                        `${request.extendedProps.members.length}人・查看名單`}
                    </TeamInfoLink>
                    <ActionBlock>
                      <ActionButton>
                        <ActionImg src={check} alt="" />
                        <div
                          onClick={() => {
                            confirmSchedule(
                              request.extendedProps.id,
                              request.extendedProps.host
                            );
                          }}
                        >
                          確認
                        </div>
                      </ActionButton>
                      {popup && (
                        <PopupNoticeModal
                          message="行程已確認"
                          toggle={setPopup}
                        />
                      )}
                      <ActionButton>
                        <ActionImg src={cancel} alt="" />
                        <div
                          onClick={() => {
                            rejectSchedule(request.extendedProps.id);
                          }}
                        >
                          拒絕
                        </div>
                      </ActionButton>
                    </ActionBlock>
                  </CardBottom>
                </ScheduleInfo>
              </ScheduleInnerWrapper>
            </ScheduleCard>
          ))
        : "尚無行程"}
    </CardWrapper>
  );
}
