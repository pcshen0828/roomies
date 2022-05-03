import React from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import List from "../components/messages/MessageList";
import MessageDetail from "../components/messages/MessageDetail";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link, useParams } from "react-router-dom";
import { Wrapper, Button1, FlexWrapper } from "../components/common/Components";

const FullWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: calc(100vh - 351px);
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  background: #fff;
  @media screen and (max-width: 995.98px) {
    height: calc(100vh - 130px);
  }
`;

const CenterWrapper = styled(Wrapper)`
  align-items: center;
  margin-bottom: 0;
`;

const Reminder = styled.div`
  margin: 60px 0 20px;
`;

const InnerWrapper = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  display: flex;
  height: 100%;
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
  }
`;

const MessageList = styled.div`
  width: 30%;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  background: #fff;
  @media screen and (max-width: 995.98px) {
    display: none;
  }
`;

const DefaultMessage = styled(FlexWrapper)`
  width: 70%;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background: #f2f5f7;
  color: #505d68;
  @media screen and (max-width: 995.98px) {
    width: 100%;
    height: 100%;
    padding: 0;
  }
`;

function Messages() {
  const { id } = useParams();
  const { currentUser, user, loading, error } = useAuth();
  const [chats, setChats] = React.useState([]);
  const [chatId, setChatId] = React.useState(id);
  const selectedChat = chats.find((chat) => chat.id === chatId);
  const myRole =
    selectedChat &&
    selectedChat.members.find((member) => member.uid === currentUser.uid).role;

  React.useEffect(() => {
    let mounted = true;
    if (loading) {
      console.log("loading");
    }
    if (user) {
      console.log(user);
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "chats"),
        Firebase.where("userIDs", "array-contains", user.uid),
        Firebase.orderBy("updateTime", "desc")
      );

      Firebase.onSnapshot(query, (querySnapshot) => {
        if (!mounted) return;
        const data = querySnapshot.docs.map((doc) => doc.data());
        if (data.length) {
          console.log(data);
          setChats(data);
        }
      });
    }

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

  function Render() {
    if (loading) {
      return <>資料處理中...</>;
    }
    if (error) {
      return <>Error: {error}</>;
    }
    if (user) {
      return chats.length ? (
        <InnerWrapper>
          <MessageList>
            <List chats={chats} setChatId={setChatId} />
          </MessageList>
          {id === "all" ? (
            <DefaultMessage>點擊聊天室開始</DefaultMessage>
          ) : (
            <MessageDetail
              chats={chats}
              currentUser={user}
              chatId={chatId}
              chat={selectedChat}
              myRole={myRole}
            />
          )}
        </InnerWrapper>
      ) : (
        <CenterWrapper>
          <Reminder>沒有對話紀錄喔！趕快開啟對話吧</Reminder>
          <Link to="/community">
            <Button1>前往探索</Button1>
          </Link>
        </CenterWrapper>
      );
    }
    return <Navigate replace to="/" />;
  }

  return <FullWrapper>{Render()}</FullWrapper>;
}

export default Messages;
