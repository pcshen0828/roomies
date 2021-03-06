import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

function MessageModal({ closeNavModal }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
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
    <NavModalOverlay out={false} onClick={closeNavModal}>
      <NavModal onClick={(e) => e.stopPropagation()}>
        <Title>聊天室</Title>
        <ChatsWrapper>
          {chats.length ? (
            <List
              chats={chats}
              nav={true}
              usage="modal"
              toggle={closeNavModal}
            />
          ) : (
            "尚無訊息"
          )}
        </ChatsWrapper>
        <MessagesLink to="/messages/all" onClick={closeNavModal}>
          查看收件匣
        </MessagesLink>
      </NavModal>
    </NavModalOverlay>
  );
}

MessageModal.propTypes = {
  closeNavModal: PropTypes.func.isRequired,
};

export default MessageModal;
