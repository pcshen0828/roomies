import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexWrap, Title } from "../common/Components";
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

const InviteList = styled(FlexWrap)`
  margin-bottom: 20px;
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

export default function SearchAndInviteToTeam({
  groupMemberDetail,
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
      setDefaultResponse("????????????");
    }
  }
  return (
    <>
      <SmallTitle>??????????????????</SmallTitle>
      <SearchBar>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            seachUsers();
          }}
        >
          <Input
            placeholder="?????????????????????"
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
                  ??
                </CancelButton>
              </InvitedUser>
            ))
          : ""}
      </InviteList>
    </>
  );
}

SearchAndInviteToTeam.propTypes = {
  groupMemberDetail: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  inviteList: PropTypes.array.isRequired,
  setInviteList: PropTypes.func.isRequired,
  setQueriedUsers: PropTypes.func.isRequired,
  setDefaultResponse: PropTypes.func.isRequired,
  queryName: PropTypes.string.isRequired,
  setQueryName: PropTypes.func.isRequired,
};
