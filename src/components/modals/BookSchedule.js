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
import { FlexWrapper, SmallTitle, Textarea } from "../common/Components";
import { MUIDatePicker, MUITimePicker } from "./DateTimePicker";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";
import calendar from "../../images/calendar.svg";
import SuccessfullySavedModal from "./SuccessfullySaved";

const HigherOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  width: 70%;
  min-width: 350px;
`;

const NewBody = styled(Body)`
  height: 380px;
  padding: 10px;
`;

const PickerWrapper = styled.div`
  margin: 20px 0;
`;

const BookedTime = styled(FlexWrapper)`
  width: 90%;
  height: 30px;
  margin-bottom: 10px;
  background: #f2f5f7;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);

  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

export default function BookScheduleModal({
  host,
  team,
  apartment,
  toggle,
  toggleParent,
}) {
  const date = new Date();
  const isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, -5);
  const [pickedDate, setPickedDate] = React.useState(isoDateTime);
  const [startTime, setStartTime] = React.useState(isoDateTime);
  const [endTime, setEndTime] = React.useState(isoDateTime);
  const [message, setMessage] = React.useState("");
  const [events, setEvents] = React.useState([]);
  const [booked, setBooked] = React.useState(false);

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "schedules"),
      Firebase.where("apartmentID", "==", apartment.id),
      Firebase.where("status", "==", 1)
    );
    const unsubscribe = Firebase.onSnapshot(query, (snapshot) => {
      const confirmedEvents = snapshot.docs.map((doc) => doc.data());
      setEvents(confirmedEvents);
    });

    return unsubscribe;
  }, []);

  function generateReadableDate(dateString) {
    return new Date(dateString).toLocaleString().slice(0, -3);
  }

  function createNoticeToOwner() {
    api.createNoticeByType(host.uid, apartment.owner, 5);
  }

  function bookSchedule() {
    const newDocRef = api.createNewDocRef("schedules");
    const time = Firebase.Timestamp.fromDate(new Date());
    api.setNewDoc(newDocRef, {
      id: newDocRef.id,
      apartmentID: apartment.id,
      createTime: time,
      updateTime: time,
      status: 0,
      host: host.uid,
      members: team.userIDs,
      team: team.id,
      start: pickedDate + "T" + startTime.substring(11),
      end: pickedDate + "T" + endTime.substring(11),
      owner: apartment.owner,
    });
    createNoticeToOwner();
    if (message.trim()) {
      api
        .getDataWithSingleQuery(
          "chats",
          "userIDs",
          "array-contains",
          apartment.owner
        )
        .then((res) => {
          return res.filter((data) => data.userIDs.includes(host.uid))[0];
        })
        .then((res) => {
          if (res) {
            const newMessage = {
              content: message,
              sender: res.members.find((member) => member.uid === host.uid)
                .role,
              timestamp: time,
            };
            api.updateDocData("chats", res.id, {
              latestMessage: newMessage,
              updateTime: time,
            });
            api.addNewDoc("chats/" + res.id + "/messages", newMessage);
            createNoticeToOwner();
            toggle(false);
          } else {
            const newMessage = {
              content: message,
              sender: 0,
              timestamp: time,
            };
            const newChatRef = api.createNewDocRef("chats");
            api.setNewDoc(newChatRef, {
              id: newChatRef.id,
              createTime: time,
              latestMessage: newMessage,
              members: [
                { role: 0, uid: host.uid },
                { role: 1, uid: apartment.owner },
              ],
              updateTime: time,
              userIDs: [host.uid, apartment.owner],
            });
            api.addNewDoc("chats/" + newChatRef.id + "/messages", newMessage);
            createNoticeToOwner();
            toggle(false);
            setBooked(true);
            toggleParent("");
          }
        });
    } else {
      toggle(false);
      setBooked(true);
      toggleParent("");
    }
  }

  return (
    <HigherOverlay out={false}>
      {booked && (
        <SuccessfullySavedModal
          out={false}
          toggle={setBooked}
          message="預約成功！"
        />
      )}
      <NewModal>
        <Header>
          <Title>預約看房</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>此房源目前已被預約的看房時段</SmallTitle>
          {events.length
            ? events.map((event) => (
                <BookedTime key={event.id}>
                  <Icon alt="" src={calendar} />
                  {generateReadableDate(event.start)} -{" "}
                  {generateReadableDate(event.end)}
                </BookedTime>
              ))
            : ""}
          <SmallTitle>選擇日期</SmallTitle>
          <PickerWrapper>
            <MUIDatePicker value={pickedDate} setValue={setPickedDate} />
          </PickerWrapper>
          <SmallTitle>選擇開始時間</SmallTitle>
          <PickerWrapper>
            <MUITimePicker value={startTime} setValue={setStartTime} />
          </PickerWrapper>
          <SmallTitle>選擇結束時間</SmallTitle>
          <PickerWrapper>
            <MUITimePicker value={endTime} setValue={setEndTime} />
          </PickerWrapper>
          <SmallTitle>留話給房東</SmallTitle>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </NewBody>
        <Button onClick={bookSchedule}>送出</Button>
      </NewModal>
    </HigherOverlay>
  );
}
