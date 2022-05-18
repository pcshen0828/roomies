import React from "react";
import { Link } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { noticeTypes } from "../../utils/noticeType";

import styled from "styled-components";
import { Bold, FlexWrapper, SmallTitle } from "../common/Components";
import { NavModalOverlay, NavModal } from "./ModalElements";

import Skeleton from "react-loading-skeleton";

const NewModal = styled(NavModal)`
  min-height: 160px;
`;

const NoticeWrapper = styled(FlexWrapper)`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  width: 100%;
  position: relative;
`;

const MessageItem = styled.div`
  border-radius: 10px;
  height: 80px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.unread ? "#f2f5f7" : "fff")};

  &:hover {
    background: #f2f5f7;
  }
`;

const MessageImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 0 10px;
`;

const MessageOverview = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageWrapper = styled(FlexWrapper)`
  align-items: flex-start;
`;

const MessageObjectName = styled.div`
  font-weight: 700;
  font-size: 14px;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #505d68;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #424b5a;
  position: absolute;
  top: 38px;
  right: 10px;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const Time = styled.div`
  font-size: 12px;
  margin-top: 5px;
`;

function NoticeModal({ setActiveIcon }) {
  const { currentUser } = useAuth();
  const [notices, setNotices] = React.useState([]);
  const stringLimit = 10;
  const [loading, setLoading] = React.useState(true);

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
    let mounted = true;
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "notices"),
      Firebase.where("receiver", "==", currentUser.uid),
      Firebase.orderBy("createTime", "desc")
    );
    Firebase.onSnapshot(query, (snapShot) => {
      const res = snapShot.docs.map((doc) => doc.data());
      let promises = [];
      res.forEach((notice) => {
        let content = {
          sender: {},
          time: calcTimeGap(notice.createTime.toDate()),
          status: notice.status,
          type: notice.type,
          id: notice.id,
        };
        promises.push(
          api
            .getDataWithSingleQuery("users", "uid", "==", notice.sender)
            .then((res) => {
              content.sender.alias = res[0].alias;
              content.sender.profileImage = res[0].profileImage;
              return content;
            })
        );
      });
      Promise.all(promises).then((res) => {
        if (!mounted) return;
        setNotices(res);
        setLoading(false);
      });
    });
    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

  function setNoticeStatusRead(status, id) {
    if (status === 1) return;
    api.updateDocData("notices", id, {
      status: 1,
    });
  }

  return (
    <NavModalOverlay out={false} onClick={() => setActiveIcon("")}>
      <NewModal onClick={(e) => e.stopPropagation()}>
        <Bold>通知</Bold>
        <SmallTitle>先前的通知</SmallTitle>
        <NoticeWrapper>
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
            : notices.length
            ? notices.map((notice) => (
                <StyledLink
                  to={`${noticeTypes.at(notice.type).path}`}
                  key={notice.id}
                  onClick={() => {
                    setNoticeStatusRead(notice.status, notice.id);
                    setActiveIcon("");
                  }}
                >
                  <UnreadDot show={notice.status === 0} />
                  <MessageItem unread={notice.status === 0}>
                    <MessageImg src={notice.sender.profileImage} />
                    <MessageOverview>
                      <MessageWrapper>
                        <MessageObjectName>
                          {notice.sender.alias}
                        </MessageObjectName>
                        <LastMessage>
                          {noticeTypes
                            .at(notice.type)
                            .message.slice(0, stringLimit)}
                          ...
                        </LastMessage>
                      </MessageWrapper>
                      <Time>・{notice.time}</Time>
                    </MessageOverview>
                  </MessageItem>
                </StyledLink>
              ))
            : "尚無通知"}
        </NoticeWrapper>
      </NewModal>
    </NavModalOverlay>
  );
}

export default NoticeModal;
