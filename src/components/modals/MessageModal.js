import React from "react";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";

import styled from "styled-components";
import { FlexWrapper, StyledLink } from "../common/Components";
import { NavModalOverlay, NavModal, Title } from "./ModalElements";
import List from "../messages/MessageList";

const ChatsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: 100%;
  margin: 10px 0;
  align-items: flex-start;
  overflow-y: auto;
`;

const MessagesLink = styled(StyledLink)`
  align-self: center;
  @media screen and (max-width: 995.98px) {
    display: none;
  }
`;

function MessageModal({ setActiveIcon }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    if (currentUser) {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "chats"),
        Firebase.where("userIDs", "array-contains", currentUser.uid),
        Firebase.orderBy("updateTime", "desc")
      );

      Firebase.onSnapshot(query, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        if (data.length) {
          if (!mounted) return;
          setChats(data);
        }
      });
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <NavModalOverlay out={false} onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>
        <Title>聊天室</Title>
        <ChatsWrapper>
          {chats.length ? (
            <List
              chats={chats}
              nav={true}
              usage="modal"
              toggle={setActiveIcon}
            />
          ) : (
            "尚無訊息"
          )}
        </ChatsWrapper>
        <MessagesLink to="/messages/all" onClick={() => setActiveIcon("")}>
          查看收件匣
        </MessagesLink>
      </NavModal>
    </NavModalOverlay>
  );
}

export default MessageModal;
