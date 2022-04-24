import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import { SmallTitle } from "../common/Components";
import MUIDateTimePicker from "./DateTimePicker";

const HigherOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  width: 70%;
`;

const NewBody = styled(Body)`
  height: 380px;
`;

export default function BookScheduleModal({ host, team, group, toggle }) {
  const date = new Date();
  const isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, -5);
  const [start, setStart] = React.useState(isoDateTime);
  const [end, setEnd] = React.useState(isoDateTime);

  React.useEffect(() => {
    console.log(host);
    console.log(team);
    console.log(group);
  }, []);

  return (
    <HigherOverlay>
      <NewModal>
        <Header>
          <Title>預約看房</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>此房源目前已排定的看房行程</SmallTitle>
          <SmallTitle>選擇開始時間</SmallTitle>
          <MUIDateTimePicker value={start} setValue={setStart} />
          <SmallTitle>選擇結束時間</SmallTitle>
          <MUIDateTimePicker value={end} setValue={setEnd} />
        </NewBody>
        <Button>送出</Button>
      </NewModal>
    </HigherOverlay>
  );
}
