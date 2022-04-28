import React from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import { NavModalOverlay, NavModal } from "./ModalElements";
import { Bold, FlexWrapper, SmallTitle } from "../common/Components";

function NoticeModal({ setActiveIcon }) {
  const { currentUser } = useAuth();
  const [notices, setNotices] = React.useState([]);

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

  React.useEffect(() => {
    let noticeMessages = [];
    const query = api.createQuery("notices", "receiver", "==", currentUser.uid);
    Firebase.onSnapshot(query, (snapShot) => {
      const res = snapShot.docs.map((doc) => doc.data());
      console.log(res);
      res.forEach((notice) => {
        let content = {
          sender: {},
          time: calcTimeGap(notice.createTime.toDate()),
          status: notice.status,
          type: notice.type,
          id: notice.id,
        };
        console.log(content);
        api
          .getDataWithSingleQuery("users", "uid", "==", notice.sender)
          .then((res) => {
            console.log(res);
            content.sender.alias = res[0].alias;
            content.sender.profileImage = res[0].profileImage;
          })
          .then(() => {
            noticeMessages.push(content);
          });
      });
      setNotices(noticeMessages);
    });
  }, [currentUser]);

  return (
    <NavModalOverlay onClick={() => setActiveIcon("")}>
      <NavModal onClick={(e) => e.stopPropagation()}>
        <Bold>通知</Bold>
        <SmallTitle>先前的通知</SmallTitle>
        {notices.length
          ? notices.map((notice) => (
              <FlexWrapper key={notice.id}>{notice.sender.alias}</FlexWrapper>
            ))
          : "尚無通知"}
      </NavModal>
    </NavModalOverlay>
  );
}

export default NoticeModal;
