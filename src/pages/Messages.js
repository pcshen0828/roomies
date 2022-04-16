import React from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import Header from "../components/layout/Header";
import List from "../components/messages/MessageList";
import MessageDetail from "../components/messages/MessageDetail";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Wrapper } from "../components/common/Components";

const FullWrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  height: calc(100vh - 350px);
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
`;

function Messages() {
  const { currentUser, user, loading, error } = useAuth();
  const [chats, setChats] = React.useState([]);
  const [chatId, setChatId] = React.useState("");

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
          setChatId(data[0].id);
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
          <List chats={chats} chatId={chatId} setChatId={setChatId} />
          <MessageDetail
            chats={chats}
            chatId={chatId}
            setChatId={setChatId}
            currentUser={user}
          />
        </InnerWrapper>
      ) : (
        <CenterWrapper>
          <Reminder>沒有對話紀錄喔！趕快開啟對話吧</Reminder>
          <Link to="/explore">
            <button>前往探索</button>
          </Link>
        </CenterWrapper>
      );
    }
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <Header />
      <FullWrapper>{Render()}</FullWrapper>
    </>
  );
}

export default Messages;
