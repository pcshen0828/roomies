import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";

import styled from "styled-components";
import {
  CardWrapper,
  ScheduleCard,
  ScheduleInnerWrapper,
  ScheduleDate,
  DateTitle,
  TimeTitle,
  ScheduleInfo,
  CardTop,
  CardBottom,
  FlexWrapper,
  ConfirmButton,
  RejectButton,
  ScheduleTitle,
} from "../common/Components";
import RequestDetailModal from "../modals/RequestDetail";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

import Skeleton from "react-loading-skeleton";

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

export default function Requests({ unConfirmed, user, loading }) {
  const [checkDetail, setCheckDetail] = useState(false);
  const [openConfirmCheck, setOpenConfirmCheck] = useState(false);
  const [openConfirmReject, setOpenConfirmReject] = useState(false);
  const [schedule, setSchedule] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  function generateReadableDate(dateString) {
    const newString = new Date(dateString).toLocaleString().slice(0, -3);
    const index = newString.indexOf("午");
    return newString.slice(index - 1, newString.length);
  }

  function confirmSchedule() {
    const time = Firebase.Timestamp.fromDate(new Date());

    api.updateDocData("schedules", schedule.id, {
      updateTime: time,
      status: 1,
    });
    api.createNoticeByType(user.uid, schedule.host, 2);
    setChecked(true);
    setTimeout(() => {
      navigate("/profile/schedule/booked");
    }, 1000);
  }

  function rejectSchedule() {
    const time = Firebase.Timestamp.fromDate(new Date());

    api.updateDocData("schedules", schedule.id, {
      updateTime: time,
      status: 2,
    });
    api.createNoticeByType(user.uid, schedule.host, 7);
    setChecked(true);
  }

  return (
    <CardWrapper>
      {openConfirmCheck && (
        <ConfirmBeforeActionModal
          message="確認核准行程？"
          action={confirmSchedule}
          toggle={setOpenConfirmCheck}
        />
      )}
      {openConfirmReject && (
        <ConfirmBeforeActionModal
          message="確認拒絕行程？"
          action={rejectSchedule}
          toggle={setOpenConfirmReject}
        />
      )}

      {checked && (
        <SuccessfullySavedModal toggle={setChecked} message="更新成功！" />
      )}

      {loading
        ? Array.from(Array(2).keys()).map((loader, index) => (
            <Skeleton
              key={index}
              width={360}
              height={220}
              borderRadius={20}
              style={{ margin: "0 20px 20px 0" }}
            />
          ))
        : unConfirmed.length
        ? unConfirmed.map((request) => (
            <ScheduleCard key={request.extendedProps.id}>
              {checkDetail && (
                <RequestDetailModal
                  members={request.extendedProps.members}
                  hostId={request.extendedProps.host}
                  toggle={setCheckDetail}
                />
              )}
              <ScheduleInnerWrapper landlord={true}>
                <ScheduleDate>
                  <DateTitle>
                    {new Date(request.start).getFullYear() !==
                      new Date().getFullYear() &&
                      new Date(request.start).getFullYear()}
                    {new Date(request.start).getMonth() + 1} /
                    {new Date(request.start).getDate()}
                  </DateTitle>
                  <TimeTitle>
                    {generateReadableDate(request.start)}-
                    {generateReadableDate(request.end)}
                  </TimeTitle>
                </ScheduleDate>
                <ScheduleInfo>
                  <CardTop>
                    <ScheduleTitle>{request.title}</ScheduleTitle>
                  </CardTop>
                  <CardBottom>
                    <TeamInfoLink onClick={() => setCheckDetail(true)}>
                      {request.extendedProps.members &&
                        `${request.extendedProps.members.length}人・查看名單`}
                    </TeamInfoLink>
                    <ActionBlock>
                      <ConfirmButton
                        onClick={() => {
                          setSchedule(request.extendedProps);
                          setOpenConfirmCheck(true);
                        }}
                      >
                        確認
                      </ConfirmButton>
                      <RejectButton
                        onClick={() => {
                          setSchedule(request.extendedProps);
                          setOpenConfirmReject(true);
                        }}
                      >
                        拒絕
                      </RejectButton>
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
