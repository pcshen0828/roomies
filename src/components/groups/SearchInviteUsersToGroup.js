import React from "react";
import styled from "styled-components";
import { Title } from "../common/Components";
import { Firebase } from "../../utils/firebase";
import search from "../../images/search.svg";

const SmallTitle = styled(Title)`
  font-size: 14px;
  margin-bottom: 10px;
`;

const SearchBar = styled.div`
  position: relative;
  width: 90%;
`;

const Input = styled.input`
  width: calc(100% - 10px);
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

const InviteList = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const InvitedUser = styled.div`
  padding: 10px 30px 10px 15px;
  border-radius: 5px;
  background: #dadada;
  font-size: 14px;
  position: relative;
  margin: 0 10px 10px 0;
`;

const CancelButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
`;

const SearchButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 6px;
  left: calc(100% - 25px);
`;

export default function SearchAndInviteToGroup({
  currentUser,
  inviteList,
  setInviteList,
  setQueriedUsers,
  setDefaultResponse,
  queryName,
  setQueryName,
}) {
  async function seachUsers(name) {
    if (!name.trim()) {
      setQueriedUsers([]);
      return;
    }
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where("status", "==", 1),
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
  return (
    <>
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
              setDefaultResponse("");
              setQueryName(e.target.value);
              seachUsers(e.target.value);
            }}
          />
          <SearchButton src={search} />
        </form>
      </SearchBar>
      <InviteList>
        {inviteList.length
          ? inviteList.map((user) => (
              <InvitedUser key={user.uid}>
                {user.name}
                <CancelButton
                  onClick={() =>
                    setInviteList((prev) =>
                      prev.filter((item) => item.uid !== user.uid)
                    )
                  }
                >
                  ×
                </CancelButton>
              </InvitedUser>
            ))
          : ""}
      </InviteList>
    </>
  );
}
