import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import userContext from "../../context/userContext";
import { Overlay, Modal, Header, CloseButton, Title } from "./ModalElements";

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

    const query = Firebase.query(
      Firebase.collection(Firebase.db, "chats"),
      Firebase.where("userIDs", "array-contains", objectId)
    );

    const querySnapShot = await Firebase.getDocs(query);
    const receivedData = querySnapShot.docs.map((doc) => doc.data());
    const targetChat = receivedData.filter((data) =>
      data.userIDs.includes(context.id)
    )[0];

    const time = Firebase.Timestamp.fromDate(new Date());
    if (targetChat) {
      const newMessage = {
        content: message,
        sender: targetChat.members.find((member) => member.uid === context.id)
          .role,
        timestamp: time,
      };
      Firebase.updateDoc(Firebase.doc(Firebase.db, "chats", targetChat.id), {
        latestMessage: newMessage,
        updateTime: time,
      });
      Firebase.addDoc(
        Firebase.collection(
          Firebase.db,
          "chats/" + targetChat.id + "/messages"
        ),
        newMessage
      );
      setMessage("");
      setOpenModal(false);
    } else {
      const newMessage = {
        content: message,
        sender: 0,
        timestamp: time,
      };
      const newChatRef = Firebase.doc(
        Firebase.collection(Firebase.db, "chats")
      );

      await Firebase.setDoc(newChatRef, {
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
      Firebase.addDoc(
        Firebase.collection(
          Firebase.db,
          "chats/" + newChatRef.id + "/messages"
        ),
        newMessage
      );
      setMessage("");
      setOpenModal(false);
    }
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
