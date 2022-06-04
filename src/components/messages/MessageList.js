import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { calcTimeGap } from "../../utils/calculate";
import api from "../../utils/api";

import styled from "styled-components";
import { FlexColumn, FlexWrapper } from "../common/Components";
import defaulImage from "../../images/default.png";

import Skeleton from "react-loading-skeleton";

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  width: 100%;
`;

const MessageItem = styled(FlexWrapper)`
  position: relative;
  border-radius: 10px;
  height: 80px;
  margin-bottom: 10px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#f2f5f7" : "fff")};

  &:hover {
    background: #f2f5f7;
  }
`;

const UnreadDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  right: 15px;
  top: 36px;
  background: #424b5a;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const LatestMessage = styled.div`
  font-weight: ${(props) => (props.unread ? "700" : "400")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
`;

const MessageImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 10px;
`;

const MessageOverview = styled(FlexColumn)``;

const MessageObjectName = styled.div`
  font-weight: 700;
`;

const LastMessage = styled(FlexWrapper)`
  font-size: 14px;
  color: #505d68;
`;

function List({ chats, setChatId, usage, toggle }) {
  const { id } = useParams();
  const location = useLocation();
  const chatroomId = location.pathname.slice(10);
  const { currentUser } = useAuth();
  const [chatUserData, setChatUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const chatMates = chats
      .map((chat) => chat.userIDs)
      .map((uids) => uids.find((userid) => userid !== currentUser.uid));

    async function getUserData() {
      api
        .getDataWithSingleQuery("users", "uid", "in", chatMates)
        .then((users) => {
          if (!mounted) return;
          setChatUserData(users);
          setLoading(false);
        });
    }

    if (chatMates.length) {
      getUserData();
    } else {
      setLoading(false);
    }

    return function cleanup() {
      mounted = false;
    };
  }, [chats]);

  function checkIsUnreadOrNot(chat) {
    return chatroomId === chat.id
      ? false
      : chat.status === 0 &&
          chat.latestMessage.sender !==
            chat.members.find((member) => member.uid === currentUser.uid).role;
  }

  function switchAndReadChatroom(id) {
    api.updateDocData("chats", id, {
      status: 1,
    });
    if (usage === "page") {
      setChatId(id);
    }
    if (usage === "modal") {
      toggle();
    }
    navigate(`/messages/${id}`);
  }

  return (
    <>
      {loading
        ? Array.from(Array(1).keys()).map((loader, index) => (
            <Skeleton
              key={index}
              width={350}
              height={80}
              borderRadius={10}
              style={{ marginBottom: "10px" }}
            />
          ))
        : chats.length
        ? chats.map((chat) => (
            <StyledLink
              key={chat.id}
              onClick={(e) => {
                e.preventDefault();
                switchAndReadChatroom(chat.id);
              }}
              to={`/messages/${chat.id}`}
            >
              <MessageItem active={chat.id === id}>
                <UnreadDot show={checkIsUnreadOrNot(chat)} />
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
                        )?.alias
                      : "..."}
                  </MessageObjectName>
                  <LastMessage>
                    {chat.latestMessage.sender ===
                    chat.members.find(
                      (member) => member.uid === currentUser.uid
                    ).role
                      ? "你："
                      : ""}
                    <LatestMessage unread={checkIsUnreadOrNot(chat)}>
                      {`${chat.latestMessage.content}`}
                    </LatestMessage>
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

List.propTypes = {
  chats: PropTypes.array.isRequired,
  setChatId: PropTypes.func,
  usage: PropTypes.string,
  toggle: PropTypes.func,
};

export default List;
