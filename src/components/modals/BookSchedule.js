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
import { SmallTitle, Textarea } from "../common/Components";
import MUIDateTimePicker from "./DateTimePicker";
import { Firebase } from "../../utils/firebase";
import api from "../../utils/api";

const HigherOverlay = styled(Overlay)`
  z-index: 1000;
`;

const NewModal = styled(Modal)`
  width: 70%;
`;

const NewBody = styled(Body)`
  height: 380px;
`;

const PickerWrapper = styled.div`
  margin: 20px 0;
`;

export default function BookScheduleModal({ host, team, apartment, toggle }) {
  const date = new Date();
  const isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, -5);
  const [start, setStart] = React.useState(isoDateTime);
  const [end, setEnd] = React.useState(isoDateTime);
  const [message, setMessage] = React.useState("");
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "schedules"),
      Firebase.where("apartmentID", "==", apartment.id),
      Firebase.where("status", "==", 1)
    );
    Firebase.onSnapshot(query, (snapshot) => {
      const confirmedEvents = snapshot.docs.map((doc) => doc.data());
      setEvents(confirmedEvents);
    });
  }, []);

  function generateReadableDate(dateString) {
    return new Date(dateString).toLocaleString().slice(0, -3);
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
      start,
      end,
      owner: apartment.owner,
    });
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
            toggle(false);
          }
        });
    } else {
      toggle(false);
    }
  }

  return (
    <HigherOverlay>
      <NewModal>
        <Header>
          <Title>預約看房</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>此房源目前已排定的看房行程</SmallTitle>
          {events.length
            ? events.map((event) => (
                <div key={event.id}>
                  {generateReadableDate(event.start)}-
                  {generateReadableDate(event.end)}
                </div>
              ))
            : ""}
          <SmallTitle>選擇開始時間</SmallTitle>
          <PickerWrapper>
            <MUIDateTimePicker value={start} setValue={setStart} />
          </PickerWrapper>
          <SmallTitle>選擇結束時間</SmallTitle>
          <PickerWrapper>
            <MUIDateTimePicker value={end} setValue={setEnd} />
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
