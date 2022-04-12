import React from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import Header from "../components/Header";
import List from "../components/MessageList";
import MessageDetail from "../components/MessageDetail";

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

function Messages({ uid }) {
  const [chats, setChats] = React.useState([]);
  const [chatId, setChatId] = React.useState("");

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "chats"),
      Firebase.where("userIDs", "array-contains", uid),
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
          <List chats={chats} uid={uid} chatId={chatId} setChatId={setChatId} />
          <MessageDetail
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
