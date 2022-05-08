import React from "react";
import styled from "styled-components";
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
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import search from "../images/search.svg";
import HobbyCard from "../components/Community/HobbyCard";
import UserCard from "../components/Community/UserCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "../components/layout/Footer";

const NewWrapper = styled(Wrapper)`
  align-items: flex-start;
  min-height: calc(100vh - 441px);
`;

const NewTitle = styled(Title)`
  margin: 0px 0 30px;
`;

const HobbyTags = styled(FlexWrapper)`
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ResultDisplayer = styled(FlexWrapper)`
  margin-top: 40px;
  flex-wrap: wrap;
  min-height: 400px;
  align-items: flex-start;
`;

function Community() {
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [users, setUsers] = React.useState();
  const [hobbies, setHobbies] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [query, setQuery] = React.useState("");

  const [searching, setSearching] = React.useState(false);

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
    setSearching(true);

    if (!queryName.trim()) {
      setUsers([]);
      setSearching(false);
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
    setSearching(false);
  }

  function Render() {
    if (loading) {
      return (
        <>
          <NewWrapper>
            <div style={{ width: "100%" }}>
              <Skeleton
                width={320}
                height={30}
                style={{ marginBottom: "30px" }}
              />
              <Skeleton
                count={5}
                width="100%"
                style={{ marginBottom: "10px" }}
              />
            </div>
          </NewWrapper>
          <Footer />
        </>
      );
    }
    if (user) {
      return (
        <>
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
                  setLoading={setSearching}
                />
              ))}
            </HobbyTags>
            <ResultDisplayer>
              {searching ? (
                <Skeleton
                  count={5}
                  width={200}
                  height={240}
                  inline={true}
                  style={{ margin: "0 20px 20px 0" }}
                />
              ) : users && users.length ? (
                users.map((user, index) => <UserCard key={index} user={user} />)
              ) : (
                ""
              )}
            </ResultDisplayer>
          </NewWrapper>
          <Footer />
        </>
      );
    }
    if (error) {
      return <>error</>;
    }
    return <Navigate replace to="/" />;
  }

  return Render();
}

export default Community;
