import React from "react";
import styled from "styled-components";
import more from "../../images/more.svg";
import notice from "../../images/notice.svg";
import noticeActive from "../../images/notice-active.svg";
import message from "../../images/message.svg";
import messageActive from "../../images/message-active.svg";
import { FlexWrapper } from "../common/Components";
import MemberModal from "../modals/MemberModal";
import MessageModal from "../modals/MessageModal";
import NoticeModal from "../modals/NoticeModal";
import { useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";

const icons = [
  {
    name: "message",
    src: message,
    activeSrc: messageActive,
  },
  {
    name: "notice",
    src: notice,
    activeSrc: noticeActive,
  },
];

const Wrapper = styled(FlexWrapper)``;

const IconWrapper = styled.div`
  position: relative;
`;

const Icon = styled.img`
  width: ${(props) => (props.name === "more" ? "8px" : "30px")};
  height: ${(props) => (props.name === "more" ? "8px" : "30px")};
  margin-left: ${(props) => (props.name === "more" ? "5px" : "20px")};
  padding-bottom: ${(props) => (props.name === "more" ? "2px" : "0")};
  cursor: pointer;
`;

const WelcomeText = styled.div`
  height: 30px;
  font-weight: 700;
  cursor: pointer;
`;

const Unread = styled(FlexWrapper)`
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 10px;
  color: #fff;
  border-radius: 50%;
  background: #ff0606;
  position: absolute;
  top: -3px;
  right: -8px;
  cursor: pointer;
`;

function LoggedIn() {
  const location = useLocation();
  const [activeicon, setActiveIcon] = React.useState("");
  const { currentUser } = useAuth();
  const [unreadChats, setUnreadChats] = React.useState();
  const [unreadChatCount, setUnreadChatCount] = React.useState();
  const [unreadNotice, setUnreadNotice] = React.useState();
  const [unreadNoticeCount, setUnreadNoticeCount] = React.useState();

  React.useEffect(() => {
    let mounted = true;
    if (currentUser) {
      const query1 = Firebase.query(
        Firebase.collection(Firebase.db, "notices"),
        Firebase.where("receiver", "==", currentUser.uid),
        Firebase.where("status", "==", 0)
      );
      Firebase.onSnapshot(query1, (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        if (!mounted) return;
        if (data.length) {
          setUnreadNotice(true);
          setUnreadNoticeCount(
            data.filter((notice) => notice.status === 0).length
          );
        } else {
          setUnreadNotice(false);
        }
      });

      const query2 = Firebase.query(
        Firebase.collection(Firebase.db, "chats"),
        Firebase.where("userIDs", "array-contains", currentUser.uid),
        Firebase.where("status", "==", 0)
      );
      Firebase.onSnapshot(query2, (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        if (!mounted) return;
        if (data.length) {
          const id = location.pathname.slice(10);
          const unreadChatRooms = data.filter(
            (chat) =>
              chat.latestMessage.sender !==
                chat.members.find((user) => user.uid === currentUser.uid)
                  .role && chat.id !== id
          );
          setUnreadChats(unreadChatRooms.length ? true : false);
          setUnreadChatCount(unreadChatRooms.length);
        } else {
          setUnreadChats(false);
        }
      });
    }

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser, location.pathname]);

  return (
    <>
      {activeicon === "member" && <MemberModal setActiveIcon={setActiveIcon} />}
      {activeicon === "message" && (
        <MessageModal setActiveIcon={setActiveIcon} />
      )}
      {activeicon === "notice" && <NoticeModal setActiveIcon={setActiveIcon} />}
      <Wrapper>
        <WelcomeText
          onClick={() => {
            setActiveIcon("member");
          }}
        >
          你好，{currentUser?.alias}
          <Icon src={more} name="more" />
        </WelcomeText>
        {icons.map((icon, index) => (
          <IconWrapper key={index}>
            {icon.name === "notice" && unreadNotice ? (
              <Unread>{unreadNoticeCount && unreadNoticeCount}</Unread>
            ) : icon.name === "message" && unreadChats ? (
              <Unread>{unreadChatCount && unreadChatCount}</Unread>
            ) : (
              ""
            )}
            {icon.name === "message" &&
            location.pathname.startsWith("/messages/") ? (
              ""
            ) : (
              <Icon
                name=""
                src={activeicon === icon.name ? icon.activeSrc : icon.src}
                onClick={() => {
                  setActiveIcon(icon.name);
                }}
              />
            )}
          </IconWrapper>
        ))}
      </Wrapper>
    </>
  );
}
export default LoggedIn;
