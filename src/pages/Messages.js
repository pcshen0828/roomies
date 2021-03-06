import { useEffect, useState, memo } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import scrollToTop from "../utils/scroll";

import styled from "styled-components";
import {
  Wrapper,
  Button1,
  FlexWrapper,
  Title,
  FlexColumn,
  SkeletonWrapper,
  SkeletonWrapperFlex,
  SkeletonWrapperWidth,
} from "../components/common/Components";
import List from "../components/messages/MessageList";
import MessageDetail from "../components/messages/MessageDetail";
import Skeleton from "react-loading-skeleton";

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

const SkeletonWrapperMarginTop = styled(SkeletonWrapper)`
  margin-top: 20px;
`;

const SkeletonWrapperFlexMarginTop = styled(SkeletonWrapperFlex)`
  margin-top: 20px;
`;

const MemoedDetail = memo(MessageDetail);

function Messages() {
  const { id } = useParams();
  const { currentUser, user, loading, error } = useAuth();
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(id);
  const [loaded, setLoaded] = useState(false);
  const selectedChat = chats.find((chat) => chat.id === chatId);
  const myRole =
    selectedChat &&
    selectedChat.members.find((member) => member.uid === currentUser?.uid)
      ?.role;

  useEffect(() => {
    let mounted = true;
    scrollToTop();

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
        }
        setLoaded(true);
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
  }, [currentUser, id]);

  function RenderLoader() {
    return (
      <InnerWrapper>
        {matchMedia("(max-width: 996px)").matches ? (
          <SkeletonWrapperMarginTop>
            <Skeleton
              width="100%"
              count={6}
              height={30}
              borderRadius={10}
              style={{ marginBottom: "10px" }}
            />
          </SkeletonWrapperMarginTop>
        ) : (
          <SkeletonWrapperFlexMarginTop>
            <SkeletonWrapperWidth width="30%">
              <Skeleton
                width="100%"
                height={80}
                count={6}
                borderRadius={10}
                style={{ marginBottom: "10px" }}
              />
            </SkeletonWrapperWidth>
            <SkeletonWrapperWidth width="65%">
              <Skeleton
                width="100%"
                count={6}
                height={30}
                borderRadius={10}
                style={{ marginBottom: "10px" }}
              />
            </SkeletonWrapperWidth>
          </SkeletonWrapperFlexMarginTop>
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
            <Title>?????????</Title>
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
            <DefaultMessage>?????????????????????</DefaultMessage>
          ) : (
            <MemoedDetail
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
          <Reminder>?????????????????????????????????????????????</Reminder>
          <Link to="/community">
            <Button1>????????????</Button1>
          </Link>
        </CenterWrapper>
      );
    }
    return <Navigate replace to="/" />;
  }

  return <FullWrapper>{Render()}</FullWrapper>;
}

export default Messages;
