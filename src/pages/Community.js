import React from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import {
  Wrapper,
  Title,
  SearchWrapper,
  SearchInput,
  SearchButton,
  FlexWrapper,
} from "../components/common/Components";
import api from "../utils/api";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import search from "../images/search.svg";
import HobbyCard from "../components/Community/HobbyCard";
import UserCard from "../components/Community/UserCard";

const NewWrapper = styled(Wrapper)`
  align-items: flex-start;
`;

const NewTitle = styled(Title)`
  margin: 0px 0 30px;
`;

const HobbyTags = styled(FlexWrapper)`
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ResultDisplayer = styled(FlexWrapper)`
  margin-top: 20px;
  flex-wrap: wrap;
`;

function Community() {
  const { currentUser } = useAuth();
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [users, setUsers] = React.useState();
  const [hobbies, setHobbies] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    api.getAllDocsFromCollection("hobbies").then((res) => {
      if (!mounted) return;
      setHobbies(res);
    });
    return function cleanup() {
      mounted = false;
    };
  }, []);

  async function searchUser(queryName) {
    if (!queryName.trim()) {
      setUsers([]);
      return;
    }
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "users"),
      Firebase.where("role", "==", 1),
      Firebase.where("status", "==", 1),
      Firebase.where("alias", ">=", queryName),
      Firebase.where("alias", "<=", queryName + "\uf8ff")
    );
    const querySnapShot = await Firebase.getDocs(query);
    const result = querySnapShot.docs.map((doc) => doc.data());
    setUsers(result);
  }

  function Render() {
    if (loading) {
      return <>loading...</>;
    }
    if (user) {
      return (
        <NewWrapper>
          <NewTitle>在這裡，找到適合共居的夥伴</NewTitle>
          <SearchWrapper>
            <SearchInput
              placeholder="搜尋用戶名稱"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                searchUser(e.target.value);
              }}
            />
            <SearchButton src={search} />
          </SearchWrapper>
          <HobbyTags>
            {hobbies.map((hobby, index) => (
              <HobbyCard
                key={index}
                name={hobby.name}
                setUsers={setUsers}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </HobbyTags>
          <ResultDisplayer>
            {users && users.length
              ? users.map((user, index) => <UserCard key={index} user={user} />)
              : ""}
          </ResultDisplayer>
        </NewWrapper>
      );
    }
    if (error) {
      return <>error</>;
    }
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <Header />
      {Render()}
    </>
  );
}

export default Community;
