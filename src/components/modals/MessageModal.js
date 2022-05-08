import React from "react";
import styled from "styled-components";
import { NavModalOverlay, NavModal, Title } from "./ModalElements";
import { FlexWrapper, StyledLink } from "../common/Components";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import List from "../messages/MessageList";

const NewNavModal = styled(NavModal)`
  max-height: 300px;
`;

const ChatsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: 100%;
  margin: 10px 0;
  align-items: flex-start;
  overflow-y: scroll;
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
        // Firebase.limit(10)
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
      <NewNavModal onClick={(e) => e.stopPropagation()}>
        <Title>聊天室</Title>
        <ChatsWrapper>
          <List chats={chats} nav={true} />
        </ChatsWrapper>
        <MessagesLink to="/messages/all" onClick={() => setActiveIcon("")}>
          查看收件匣
        </MessagesLink>
      </NewNavModal>
    </NavModalOverlay>
  );
}

export default MessageModal;
