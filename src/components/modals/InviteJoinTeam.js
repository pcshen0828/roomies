import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import { Button1, SmallTitle } from "../common/Components";
import search from "../../images/search.svg";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const NewBody = styled(Body)`
  height: 280px;
  padding: 10px;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 90%;
  height: 30px;
  border: 1px solid #dadada;
  margin-bottom: 20px;
  padding-left: 10px;
  color: #424b5a;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border: 1px solid #c1b18a;
  }
`;

const SmallText = styled.div`
  font-size: 14px;
`;

const SearchButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 6px;
  left: calc(90% - 15px);
`;

const QueriedUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  margin-bottom: 20px;
`;

const FlexWrapper = styled.div`
  display: flex;
  margin-right: 10px;
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const InviteButton = styled(Button1)`
  width: 90px;
  height: 35px;
`;

const Status = styled(FlexWrapper)`
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 35px;
  background: #e8e8e8;
  border-radius: 5px;
  margin: 0;
`;

const InviteList = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const InvitedUser = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: #dadada;
  font-size: 14px;
`;

const CancelButton = styled.div`
  cursor: pointer;
`;

export default function InviteJoinTeamModal({
  toggle,
  team,
  groupMemberDetail,
}) {
  const [queryName, setQueryName] = React.useState("");
  const [queriedUsers, setQueriedUsers] = React.useState([]);
  const [defaultResponse, setDefaultResponse] = React.useState("");
  const [inviteList, setInviteList] = React.useState([]);
  const { currentUser } = useAuth();

  async function seachUsers(name) {
    if (!name.trim()) {
      setQueriedUsers([]);
      return;
    }
    setDefaultResponse("請輸入使用者名稱");
    // 應該只能從已經在社團裡面的成員搜尋
    // groupMemberDetail
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where(
        "uid",
        "in",
        groupMemberDetail.map((member) => member.uid)
      ),
      Firebase.where("alias", ">=", name),
      Firebase.where("alias", "<=", name + "\uf8ff")
    );

    const querySnapShot = await Firebase.getDocs(query);
    const result = querySnapShot.docs.map((doc) => doc.data());
    if (result.length) {
      const theUsers = result.filter((user) => user.uid !== currentUser.uid);
      setQueriedUsers(theUsers);
    } else {
      setDefaultResponse("查無結果");
    }
  }

  async function inviteNewMember() {
    const time = Firebase.Timestamp.fromDate(new Date());
    const newList = inviteList.map(({ name, ...rest }) => {
      return rest;
    });
    const uids = newList.map((user) => user.uid);
    api.updateDocData("teams", team.id, {
      members: [...team.members, ...newList],
      userIDs: [...team.userIDs, ...uids],
      updateTime: time,
    });

    // 通知被邀請對象
    uids.forEach((uid) => {
      api.createNoticeByType(currentUser.uid, uid, 4);
    });
    toggle(false);
  }

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>邀請社團成員加入群組</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>搜尋用戶</SmallTitle>
          <SearchBar>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                seachUsers();
              }}
            >
              <Input
                placeholder="請輸入用戶名稱"
                value={queryName}
                onChange={(e) => {
                  setQueryName(e.target.value);
                  seachUsers(e.target.value);
                }}
              />
              <SearchButton src={search} />
            </form>
          </SearchBar>
          <InviteList>
            {inviteList.length
              ? inviteList.map((user, index) => (
                  <FlexWrapper key={index}>
                    <InvitedUser>{user.name}</InvitedUser>
                    <CancelButton
                      onClick={() =>
                        setInviteList((prev) =>
                          prev.filter((item) => item.uid !== user.uid)
                        )
                      }
                    >
                      ×
                    </CancelButton>
                  </FlexWrapper>
                ))
              : ""}
          </InviteList>
          {queriedUsers.length ? (
            queriedUsers.map((user, index) => (
              <QueriedUser key={index}>
                <FlexWrapper>
                  <UserImage src={user.profileImage} />
                  <UserInfo>
                    <SmallTitle>{user.alias}</SmallTitle>
                    <SmallText>{user.jobTitle}</SmallText>
                  </UserInfo>
                </FlexWrapper>
                {!team.members
                  .map((member) => member.uid)
                  .includes(user.uid) ? (
                  <InviteButton
                    onClick={() => {
                      setInviteList((prev) => [
                        ...prev,
                        { uid: user.uid, name: user.alias, status: 2 },
                      ]);
                      setQueryName("");
                      setQueriedUsers([]);
                    }}
                  >
                    新增
                  </InviteButton>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 1 ? (
                  <Status>成員</Status>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 2 ? (
                  <Status>邀請中</Status>
                ) : team.members.find((member) => member.uid === user.uid)
                    .status === 3 ? (
                  <Status>待核准</Status>
                ) : (
                  ""
                )}
              </QueriedUser>
            ))
          ) : (
            <SmallText>{defaultResponse}</SmallText>
          )}
        </NewBody>
        <Button onClick={inviteNewMember}>邀請</Button>
      </Modal>
    </Overlay>
  );
}
