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
import { Button1 } from "../common/Components";
import { Firebase } from "../../utils/firebase";
import search from "../../images/search.svg";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const NewBody = styled(Body)`
  border: none;
  display: flex;
  flex-direction: column;
  height: 300px;
`;

const SmallTitle = styled(Title)`
  font-size: 14px;
  margin-bottom: 10px;
`;

const SmallText = styled.div`
  font-size: 14px;
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
  margin-bottom: 10px;
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

function NewTeamModal({ toggle, aid, members, groupId, groupMemberDetail }) {
  const [teamName, setTeamName] = React.useState("");
  const [queryName, setQueryName] = React.useState("");
  const [queriedUsers, setQueriedUsers] = React.useState([]);
  const [defaultResponse, setDefaultResponse] = React.useState("");
  const [inviteList, setInviteList] = React.useState([]);
  const { currentUser } = useAuth();

  async function seachUsers() {
    if (!queryName.trim()) return;
    // 應該只能搜尋社團內的成員
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where("alias", ">=", queryName),
      Firebase.where("alias", "<=", queryName + "\uf8ff")
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

  async function createTeam() {
    if (!teamName.trim()) return;
    const newTeamRef = api.createNewDocRef("teams");
    const time = Firebase.Timestamp.fromDate(new Date());
    const newList = inviteList.map(({ name, ...rest }) => {
      return rest;
    });
    const uids = newList.map((user) => user.uid);
    newList.push({ uid: currentUser.uid, status: 0 });
    api.setNewDoc(newTeamRef, {
      id: newTeamRef.id,
      apartmentID: aid,
      name: teamName,
      members: newList,
      userIDs: [...uids, currentUser.uid],
      createTime: time,
      updateTime: time,
    });
    const newToGroupList = newList
      .filter((user) => !members.includes(user.uid))
      .map((user) => user.uid);
    if (newToGroupList.length) {
      api.updateDocData("groups", groupId, {
        members: [...members, ...newToGroupList],
      });
    }
    // 通知被邀請對象
    uids.forEach((uid) => {
      api.createNoticeByType(currentUser.uid, uid, 4);
    });

    toggle(false);
  }

  return (
    <Overlay out={false}>
      <Modal>
        <Header>
          <Title>建立群組</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>群組名稱</SmallTitle>
          <Input
            placeholder="請輸入群組名稱"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <SmallTitle>邀請他人</SmallTitle>
          <SearchBar>
            <Input
              placeholder="請輸入用戶名稱"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
            />
            <SearchButton src={search} onClick={seachUsers} />
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
          {queriedUsers.length
            ? queriedUsers.map((user, index) => (
                <QueriedUser key={index}>
                  <FlexWrapper>
                    <UserImage src={user.profileImage} />
                    <UserInfo>
                      <SmallTitle>{user.alias}</SmallTitle>
                      <SmallText>{user.jobTitle}</SmallText>
                    </UserInfo>
                  </FlexWrapper>
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
                    邀請
                  </InviteButton>
                </QueriedUser>
              ))
            : defaultResponse}
        </NewBody>
        <Button onClick={createTeam}>建立群組</Button>
      </Modal>
    </Overlay>
  );
}

export default NewTeamModal;
