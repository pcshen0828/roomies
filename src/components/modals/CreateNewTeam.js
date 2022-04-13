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
import { Firebase } from "../../utils/firebase";
import search from "../../images/search.svg";
import userContext from "../../context/userContext";

const NewBody = styled(Body)`
  border: none;
  display: flex;
  flex-direction: column;
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

const InviteButton = styled.button`
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

function NewTeamModal({ toggle, aid }) {
  const [teamName, setTeamName] = React.useState("");
  const [queryName, setQueryName] = React.useState("");
  const [queriedUsers, setQueriedUsers] = React.useState([]);
  const [defaultResponse, setDefaultResponse] = React.useState("");
  const [inviteList, setInviteList] = React.useState([]);
  const context = React.useContext(userContext);

  async function seachUsers() {
    if (!queryName.trim()) return;
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where("alias", ">=", queryName),
      Firebase.where("alias", "<=", queryName + "\uf8ff")
    );

    const querySnapShot = await Firebase.getDocs(query);
    const result = querySnapShot.docs.map((doc) => doc.data());
    if (result.length) {
      const theUsers = result.filter((user) => user.uid !== context.id);
      setQueriedUsers(theUsers);
    } else {
      setDefaultResponse("查無結果");
    }
  }

  async function createTeam() {
    const newTeamRef = Firebase.doc(Firebase.collection(Firebase.db, "teams"));
    const time = Firebase.Timestamp.fromDate(new Date());
    const newList = inviteList.map(({ name, ...rest }) => {
      return rest;
    });
    newList.push({ uid: context.id, status: 0 });

    await Firebase.setDoc(newTeamRef, {
      id: newTeamRef.id,
      apartmentID: aid,
      name: teamName,
      members: newList,
      createTime: time,
      updateTime: time,
    });
    toggle(false);
  }

  return (
    <Overlay>
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
