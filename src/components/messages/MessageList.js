import React from "react";
import styled from "styled-components";
import defaulImage from "../../images/default.png";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  width: 100%;
`;

const MessageItem = styled.div`
  border-radius: 10px;
  height: 80px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.active ? "#f2f5f7" : "fff")};

  &:hover {
    background: #f2f5f7;
  }
`;

const MessageImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 10px;
`;

const MessageOverview = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageObjectName = styled.div`
  font-weight: 700;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #505d68;
`;

function List({ chats, setChatId }) {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [chatUserData, setChatUserData] = React.useState([]);
  const stringLimit = 6;

  React.useEffect(() => {
    let mounted = true;
    const chatMates = chats
      .map((chat) => chat.userIDs)
      .map((uids) => uids.find((userid) => userid !== currentUser.uid));

    async function getUserData() {
      api
        .getDataWithSingleQuery("users", "uid", "in", chatMates)
        .then((res) => {
          if (!mounted) return;
          setChatUserData(res);
        });
    }

    if (chatMates.length) {
      getUserData();
    }

    return function cleanup() {
      mounted = false;
    };
  }, [chats]);

  function calcTimeGap(time) {
    const ObjectTime = Date.parse(new Date(time));
    const now = Date.parse(new Date());
    const milleSecondsPerDay = 24 * 3600 * 1000;
    const gapMilleSeconds = now - ObjectTime;
    const days = gapMilleSeconds / milleSecondsPerDay;
    return Math.floor(days) > 365
      ? `${Math.floor(days / 365)}年`
      : Math.floor(days) > 30
      ? `${Math.floor(days / 30)}個月`
      : Math.floor(days) > 7
      ? `${Math.floor(days / 7)}週`
      : Math.floor(days) >= 1
      ? `${Math.floor(days)}天`
      : Math.floor(days * 24) >= 1
      ? `${Math.floor(days * 24)}小時`
      : Math.floor(days * 24 * 60) >= 1
      ? `${Math.floor(days * 24 * 60)}分鐘`
      : "現在";
  }
  return (
    <>
      {chats.length
        ? chats.map((chat) => (
            <StyledLink
              key={chat.id}
              onClick={() => {
                console.log(chat.id);
                setChatId(chat.id);
              }}
              to={`/messages/${chat.id}`}
            >
              <MessageItem active={chat.id === id}>
                <MessageImg
                  src={
                    chatUserData.length
                      ? chatUserData.find(
                          (userData) =>
                            userData.uid ===
                            chat.userIDs.find(
                              (userID) => userID !== currentUser.uid
                            )
                        )?.profileImage
                      : defaulImage
                  }
                />
                <MessageOverview>
                  <MessageObjectName>
                    {chatUserData.length
                      ? chatUserData.find(
                          (userData) =>
                            userData.uid ===
                            chat.userIDs.find(
                              (userID) => userID !== currentUser.uid
                            )
                        ).alias
                      : "..."}
                  </MessageObjectName>
                  <LastMessage>
                    {chat.latestMessage.sender ===
                    chat.members.find(
                      (member) => member.uid === currentUser.uid
                    ).role
                      ? "你："
                      : ""}
                    {`${chat.latestMessage.content.slice(0, stringLimit)}`}
                    {chat.latestMessage.content.length > stringLimit
                      ? "..."
                      : ""}
                    <span> · {calcTimeGap(chat.updateTime.toDate())}</span>
                  </LastMessage>
                </MessageOverview>
              </MessageItem>
            </StyledLink>
          ))
        : ""}
    </>
  );
}

export default List;
