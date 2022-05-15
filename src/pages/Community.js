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

const NewButton = styled(SearchButton)`
  right: 18px;
  top: 5px;
`;

const HobbyTags = styled(FlexWrapper)`
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ResultDisplayer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 390px);
  justify-content: space-between;
  margin: 20px auto 0;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }
`;

const Card = styled.div`
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 0px 10px 10px 0;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);

  background: ${(props) => (props.active ? "#c1b18a" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#424b5a")};
  &:hover {
    background: #c1b18a;
    color: #fff;
    border: 1px solid #fff;
  }
`;

const Anchor = styled.div`
  width: 100%;
  height: 40px;
`;

function Community() {
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [allUsers, setAllUsers] = React.useState([]);
  const [users, setUsers] = React.useState();
  const [hobbies, setHobbies] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [query, setQuery] = React.useState("");

  const [searching, setSearching] = React.useState(false);

  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 6;
  const anchor = React.useRef();
  const firstRender = React.useRef();
  const currentPage = React.useRef(1);
  const allPages = React.useRef();

  function calcAllPages(data) {
    return Math.ceil(data.length / itemsPerPage);
  }

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    firstRender.current = true;

    let mounted = true;

    async function getAllUsers() {
      if (!mounted) return;
      api.getAllDocsFromCollection("hobbies").then((res) => {
        if (!mounted) return;
        setHobbies(res);
      });
      setSearching(true);
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "users"),
        Firebase.where("role", "==", 1),
        Firebase.where("status", "==", 1)
      );
      const querySnapShot = await Firebase.getDocs(query);
      const result = querySnapShot.docs.map((doc) => doc.data());
      setAllUsers(result);
      setUsers(result);
      setSearching(false);
      firstRender.current = false;
      allPages.current = calcAllPages(result);
    }

    if (firstRender.current) {
      getAllUsers();
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio <= 0) return;
      if (firstRender.current) return;

      currentPage.current++;
      if (currentPage.current > allPages.current) return;
      setPaging(currentPage.current);
    });
    intersectionObserver.observe(anchor.current);
  }, []);

  function searchUser(queryName) {
    setSearching(true);

    if (!queryName.trim()) {
      setUsers(allUsers);
      setSearching(false);
      return;
    }
    setUsers(allUsers.filter((user) => user.alias.includes(queryName)));
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
                  if (!e.target.value.trim()) {
                    setPaging(1);
                    setUsers(allUsers);
                    allPages.current = calcAllPages(allUsers);
                  }
                  currentPage.current = 1;
                  setQuery(e.target.value);
                  searchUser(e.target.value);
                }}
              />
              <NewButton src={search} />
            </SearchWrapper>
            <HobbyTags>
              <Card
                active={selected === "all"}
                onClick={() => {
                  setSelected("all");
                  setUsers(allUsers);
                  setPaging(1);
                  allPages.current = calcAllPages(allUsers);
                  currentPage.current = 1;
                }}
              >
                全部
              </Card>
              {hobbies.map((hobby, index) => (
                <HobbyCard
                  key={index}
                  name={hobby.name}
                  setUsers={setUsers}
                  selected={selected}
                  setSelected={setSelected}
                  setLoading={setSearching}
                  allUsers={allUsers}
                  page={currentPage}
                  setPaging={setPaging}
                  allPages={allPages}
                  calcAllPages={calcAllPages}
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
                users
                  .slice(0, itemsPerPage * paging)
                  .map((user, index) => <UserCard key={index} user={user} />)
              ) : (
                "查無用戶"
              )}
            </ResultDisplayer>
            <Anchor ref={anchor}></Anchor>
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
