import React from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import Header from "../components/Header";
import List from "../components/MessageList";
import Detail from "../components/MessageDetail";

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
  const [chats, setChats] = React.useState([]);
  const uid = "WsCusZrITBV9gnZd4u91";
  const [chatId, setChatId] = React.useState("");

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "chats"),
      Firebase.where("uid", "array-contains", uid),
      Firebase.orderBy("updateTime", "desc")
    );

    const unsubscribe = Firebase.onSnapshot(query, (querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      setChats(querySnapshot.docs.map((doc) => doc.data()));
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
          <List chats={chats} uid={uid} chatId={chatId} setChatId={setChatId} />
          <Detail
            chats={chats}
            uid={uid}
            chatId={chatId}
            setChatId={setChatId}
          />
        </InnerWrapper>
      </Wrapper>
    </>
  );
}

export default Messages;
