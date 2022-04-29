import React from "react";
import styled from "styled-components";
import member from "../../images/member.svg";
import memberActive from "../../images/member-active.svg";
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
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const icons = [
  {
    name: "member",
    src: member,
    activeSrc: memberActive,
  },
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

const IconWrapper = styled.div`
  position: relative;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 20px;
  cursor: pointer;
`;

const Unread = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #424b5a;
  position: absolute;
  top: 1px;
  right: 0px;
`;

function LoggedIn() {
  const location = useLocation();
  const [activeicon, setActiveIcon] = React.useState("");
  const { currentUser } = useAuth();
  const [unreadMessage, setUnreadMessage] = React.useState();
  const [unreadNotice, setUnreadNotice] = React.useState();

  React.useEffect(() => {
    let mounted = true;
    if (currentUser) {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "notices"),
        Firebase.where("receiver", "==", currentUser.uid),
        Firebase.where("status", "==", 0)
      );

      Firebase.onSnapshot(query, (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        console.log(data);
        if (!mounted) return;
        if (data.length) {
          setUnreadNotice(true);
        } else {
          setUnreadNotice(false);
        }
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

  return (
    <>
      {activeicon === "member" && <MemberModal setActiveIcon={setActiveIcon} />}
      {activeicon === "message" && (
        <MessageModal setActiveIcon={setActiveIcon} />
      )}
      {activeicon === "notice" && <NoticeModal setActiveIcon={setActiveIcon} />}
      <FlexWrapper>
        {icons.map((icon, index) => (
          <IconWrapper key={index}>
            {icon.name === "notice" && unreadNotice ? <Unread /> : ""}
            <Icon
              src={
                activeicon === icon.name ||
                (icon.name === "member" &&
                  location.pathname.startsWith("/profile/")) ||
                (icon.name === "message" &&
                  location.pathname.startsWith("/messages/"))
                  ? icon.activeSrc
                  : icon.src
              }
              onClick={() => {
                setActiveIcon(icon.name);
                if (icon.name === "notice") {
                }
              }}
            />
          </IconWrapper>
        ))}
      </FlexWrapper>
    </>
  );
}
export default LoggedIn;
