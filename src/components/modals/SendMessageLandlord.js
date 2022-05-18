import React from "react";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import { Overlay, Modal, Header, CloseButton, Title } from "./ModalElements";
import { Button1 } from "../common/Components";
import ConfirmBeforeActionModal from "./ConfirmBeforeAction";

const NewModal = styled(Modal)`
  max-width: 700px;
`;

const MessageInput = styled.textarea`
  width: calc(100% - 40px);
  border: 1px solid #dadada;
  height: 200px;
  overflow-y: auto;
  margin: 20px auto;
  font-family: "Noto Sans TC", sans-serif;
  color: #424b5a;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const DefaultMessages = styled.div`
  display: flex;
  width: calc(100% - 40px);
  margin: 0 auto 10px;
  overflow-x: auto;
`;

const DefaultMessage = styled.input`
  color: #424b5a;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
  padding: 10px;
  background: none;
  border: 1px solid #dadada;

  &:hover {
    background: #dadada;
  }
`;

const Button = styled(Button1)`
  align-self: end;
  margin: 20px 20px 40px 0;
`;

function SendMessageLandlordModal({ setOpenModal, objectId, setSaved }) {
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const defaultmessages = [
    "您好，我想了解目前房源的出租情形",
    "您好，我想詢問房源詳細的設備",
  ];
  const [message, setMessage] = React.useState("");

  async function sendMyMessage() {
    if (!message.trim()) return;
    const time = Firebase.Timestamp.fromDate(new Date());
    function clearMessageAndCloseModal() {
      setMessage("");
      setOpenModal(false);
      setSaved(true);
    }
    api
      .getDataWithSingleQuery("chats", "userIDs", "array-contains", objectId)
      .then((res) => {
        return res.filter((data) => data.userIDs.includes(currentUser.uid))[0];
      })
      .then((res) => {
        if (res) {
          const newMessage = {
            content: message,
            sender: res.members.find((member) => member.uid === currentUser.uid)
              .role,
            timestamp: time,
          };
          api.updateDocData("chats", res.id, {
            latestMessage: newMessage,
            updateTime: time,
            status: 0,
          });
          api.addNewDoc("chats/" + res.id + "/messages", newMessage);
          clearMessageAndCloseModal();
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
              { role: 0, uid: currentUser.uid },
              { role: 1, uid: objectId },
            ],
            updateTime: time,
            userIDs: [currentUser.uid, objectId],
            status: 0,
          });
          api.addNewDoc("chats/" + newChatRef.id + "/messages", newMessage);
          clearMessageAndCloseModal();
        }
      });
  }

  return (
    <Overlay out={false}>
      {openConfirm && (
        <ConfirmBeforeActionModal
          message="確認送出？"
          action={sendMyMessage}
          toggle={setOpenConfirm}
        />
      )}
      <NewModal>
        <Header>
          <Title>發送訊息</Title>
          <CloseButton onClick={() => setOpenModal(false)}>×</CloseButton>
        </Header>
        <MessageInput
          placeholder="打聲招呼吧！"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <DefaultMessages>
          {defaultmessages.map((message, index) => (
            <DefaultMessage
              key={index}
              value={message}
              type="button"
              onClick={(e) => setMessage((prev) => prev + e.target.value)}
            />
          ))}
        </DefaultMessages>
        <Button
          onClick={() => {
            if (!message.trim()) return;
            setOpenConfirm(true);
          }}
        >
          確認送出
        </Button>
      </NewModal>
    </Overlay>
  );
}

export default SendMessageLandlordModal;
