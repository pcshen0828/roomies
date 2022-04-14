import React from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import userContext from "../context/userContext";
import Header from "../components/layout/Header";
import List from "../components/messages/MessageList";
import MessageDetail from "../components/messages/MessageDetail";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  height: calc(100vh - 350px);
`;

const InnerWrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  display: flex;
`;

function Messages() {
  const context = React.useContext(userContext);
  const [chats, setChats] = React.useState([]);
  const [chatId, setChatId] = React.useState("");

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "chats"),
      Firebase.where("userIDs", "array-contains", context.id),
      Firebase.orderBy("updateTime", "desc")
    );

    const unsubscribe = Firebase.onSnapshot(query, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      console.log(data);
      setChats(data);
      // modify me
      setChatId(data[0].id);
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Header />
      <Wrapper>
        <InnerWrapper>
          <List chats={chats} chatId={chatId} setChatId={setChatId} />
          <MessageDetail chats={chats} chatId={chatId} setChatId={setChatId} />
        </InnerWrapper>
      </Wrapper>
    </>
  );
}

export default Messages;
