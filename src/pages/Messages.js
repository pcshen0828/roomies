import React from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import List from "../components/messages/MessageList";
import MessageDetail from "../components/messages/MessageDetail";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link, useParams } from "react-router-dom";
import {
  Wrapper,
  Button1,
  FlexWrapper,
  Title,
  FlexColumn,
} from "../components/common/Components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../utils/api";

const FullWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: calc(100vh - 80px);
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  background: #fff;
  position: sticky;
  top: 80px;
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
  @media screen and (max-width: 1279.98px) {
    width: 100%;
    max-width: 100%;
  }
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
  }
`;

const ListWrapper = styled(FlexColumn)`
  width: 30%;
  border-right: 1px solid #e8e8e8;
  padding: 20px;
  align-items: flex-start;
  @media screen and (max-width: 995.98px) {
    display: none;
  }
`;

const MessageList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #fff;
  margin-top: 10px;
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
  const [loaded, setLoaded] = React.useState(false);
  const selectedChat = chats.find((chat) => chat.id === chatId);
  const myRole =
    selectedChat &&
    selectedChat.members.find((member) => member.uid === currentUser?.uid)
      ?.role;

  React.useEffect(() => {
    let mounted = true;
    if (loading) {
      console.log("loading");
    }
    if (user) {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "chats"),
        Firebase.where("userIDs", "array-contains", user.uid),
        Firebase.orderBy("updateTime", "desc")
      );

      Firebase.onSnapshot(query, (querySnapshot) => {
        if (!mounted) return;
        const data = querySnapshot.docs.map((doc) => doc.data());
        if (data.length) {
          setChats(data);
          setLoaded(true);
        } else {
          setLoaded(true);
        }
      });
    }

    return function cleanup() {
      mounted = false;
      if (id !== "all" && selectedChat?.latestMessage.sender !== myRole) {
        api.updateDocData("chats", id, {
          status: 1,
        });
      }
    };
  }, [currentUser, id, loading, user, myRole, selectedChat]);

  function RenderLoader() {
    return (
      <InnerWrapper>
        {matchMedia("(max-width: 996px)").matches ? (
          <div
            style={{
              width: "100%",
              marginTop: "20px",
            }}
          >
            <Skeleton
              width="100%"
              count={6}
              height={30}
              borderRadius={10}
              style={{ marginBottom: "10px" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "30%" }}>
              <Skeleton
                width="100%"
                height={80}
                count={6}
                borderRadius={10}
                style={{ marginBottom: "10px" }}
              />
            </div>
            <div style={{ width: "65%" }}>
              <Skeleton
                width="100%"
                count={6}
                height={30}
                borderRadius={10}
                style={{ marginBottom: "10px" }}
              />
            </div>
          </div>
        )}
      </InnerWrapper>
    );
  }

  function Render() {
    if (loading) {
      return RenderLoader();
    }
    if (error) {
      return <>Error: {error}</>;
    }
    if (user) {
      return !loaded ? (
        RenderLoader()
      ) : chats.length ? (
        <InnerWrapper>
          <ListWrapper>
            <Title>聊天室</Title>

            <MessageList>
              {loaded ? (
                <List chats={chats} setChatId={setChatId} usage="page" />
              ) : (
                Array.from(Array(3).keys()).map((loader, index) => (
                  <Skeleton
                    key={index}
                    width={270}
                    height={80}
                    borderRadius={10}
                    style={{ marginBottom: "10px" }}
                  />
                ))
              )}
            </MessageList>
          </ListWrapper>
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
