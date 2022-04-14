import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import userContext from "../../context/userContext";
import { Overlay, Modal, Header, CloseButton, Title } from "./ModalElements";
import api from "../../utils/api";

const MessageInput = styled.textarea`
  width: calc(100% - 40px);
  border: 1px solid #dadada;
  height: 200px;
  overflow-y: scroll;
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

const Button = styled.button`
  align-self: end;
  margin: 20px 20px 40px 0;
`;

function SendMessageModal({ setOpenModal, objectId }) {
  const context = React.useContext(userContext);
  const defaultmessages = ["Hi，你好！", "我正在尋找室友"];
  const [message, setMessage] = React.useState("");

  async function sendMyMessage() {
    if (!message.trim()) return;
    const time = Firebase.Timestamp.fromDate(new Date());
    function clearMessageAndCloseModal() {
      setMessage("");
      setOpenModal(false);
    }
    api
      .getDataWithSingleQuery("chats", "userIDs", "array-contains", objectId)
      .then((res) => {
        return res.filter((data) => data.userIDs.includes(context.id))[0];
      })
      .then((res) => {
        if (res) {
          const newMessage = {
            content: message,
            sender: res.members.find((member) => member.uid === context.id)
              .role,
            timestamp: time,
          };
          api.updateDocData("chats", res.id, {
            latestMessage: newMessage,
            updateTime: time,
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
              { role: 0, uid: context.id },
              { role: 1, uid: objectId },
            ],
            updateTime: time,
            userIDs: [context.id, objectId],
          });
          api.addNewDoc("chats/" + newChatRef.id + "/messages", newMessage);
          clearMessageAndCloseModal();
        }
      });
  }

  return (
    <Overlay>
      <Modal>
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
        <Button onClick={sendMyMessage}>確認送出</Button>
      </Modal>
    </Overlay>
  );
}

export default SendMessageModal;
