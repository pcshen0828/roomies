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

const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 20px;
  cursor: pointer;
`;

function LoggedIn() {
  const location = useLocation();
  const [activeicon, setActiveIcon] = React.useState("");
  return (
    <>
      {activeicon === "member" && <MemberModal setActiveIcon={setActiveIcon} />}
      {activeicon === "message" && (
        <MessageModal setActiveIcon={setActiveIcon} />
      )}
      {activeicon === "notice" && <NoticeModal setActiveIcon={setActiveIcon} />}
      <FlexWrapper>
        {icons.map((icon, index) => (
          <React.Fragment key={index}>
            <Icon
              src={
                activeicon === icon.name ||
                (icon.name === "member" && location.pathname === "/profile") ||
                (icon.name === "message" &&
                  location.pathname.startsWith("/messages/"))
                  ? icon.activeSrc
                  : icon.src
              }
              onClick={() => setActiveIcon(icon.name)}
            />
          </React.Fragment>
        ))}
      </FlexWrapper>
    </>
  );
}
export default LoggedIn;
