import { useEffect, useReducer, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Firebase } from "../utils/firebase";
import api from "../utils/api";

import styled from "styled-components";
import {
  Wrapper,
  Title,
  SearchWrapper,
  SearchInput,
  SearchButton,
  FlexWrapper,
} from "../components/common/Components";
import HobbyCard from "../components/community/HobbyCard";
import UserCard from "../components/community/UserCard";
import Footer from "../components/layout/Footer";
import Skeleton from "react-loading-skeleton";
import search from "../images/search.svg";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { FooterHeight, HeaderHeight } from "../styles/GlobalStyle";

const NewWrapper = styled(Wrapper)`
  align-items: flex-start;
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
`;

const NewTitle = styled(Title)`
  margin: 0px 0 30px;
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

const initialState = {
  allUsers: [],
  hobby: "",
  search: "",
  currentPage: 1,
  allPages: 1,
  usersPerPage: 9,
};

function calculateAllPages(allUsers, condition, payload, usersPerPage) {
  return Math.ceil(
    allUsers.filter((user) =>
      condition === "hobby"
        ? user.hobbies.includes(payload)
        : user.alias.includes(payload)
    ).length / usersPerPage
  );
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "update":
      return {
        ...state,
        allUsers: payload,
        allPages: Math.ceil(payload.length / state.usersPerPage),
      };
    case "filterByHobby":
      return {
        ...state,
        hobby: payload,
        search: "",
        currentPage: 1,
        allPages: calculateAllPages(
          state.allUsers,
          "hobby",
          payload,
          state.usersPerPage
        ),
      };
    case "filterByKeyword":
      return {
        ...state,
        hobby: "",
        search: payload,
        allPages: calculateAllPages(
          state.allUsers,
          "search",
          payload,
          state.usersPerPage
        ),
        currentPage: 1,
      };
    case "reset":
      return {
        ...state,
        hobby: "",
        search: "",
        currentPage: 1,
        allPages: Math.ceil(state.allUsers.length / state.usersPerPage),
      };
    case "updateCurrentPage":
      return { ...state, currentPage: state.currentPage + payload };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

function Community() {
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);

  const [filterData, dispatch] = useReducer(reducer, initialState);

  const [hobbies, setHobbies] = useState([]);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const anchor = useRef();
  const firstRender = useRef();

  useEffect(() => {
    firstRender.current = true;
    let mounted = true;

    async function getAllUsers() {
      if (!mounted) return;

      api.getAllDocsFromCollection("hobbies").then((allHobbies) => {
        if (!mounted) return;
        setHobbies(allHobbies);
      });

      setSearching(true);

      const query = Firebase.query(
        Firebase.collection(Firebase.db, "users"),
        Firebase.where("role", "==", 1),
        Firebase.where("status", "==", 1)
      );
      const querySnapShot = await Firebase.getDocs(query);
      const result = querySnapShot.docs.map((doc) => doc.data());

      dispatch({ type: "update", payload: result });
      setSearching(false);
      firstRender.current = false;
    }

    if (firstRender.current) {
      getAllUsers();
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useInfiniteScroll({
    firstRender,
    dispatch,
    filterData,
    anchor,
    dependency: user,
  });

  function searchUser(queryName) {
    if (!queryName.trim()) {
      dispatch({ type: "reset" });
      return;
    }
    setSearching(true);
    dispatch({ type: "filterByKeyword", payload: queryName });
    setSearching(false);
  }

  const filterFunction = (user) => {
    if (filterData.search) {
      return user.alias.includes(filterData.search);
    }
    if (filterData.hobby) {
      return user.hobbies.includes(filterData.hobby);
    }
    return true;
  };

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
                onFocus={() => setSelected("")}
                onChange={(e) => {
                  setQuery(e.target.value);
                  searchUser(e.target.value);
                }}
              />
              <SearchButton src={search} />
            </SearchWrapper>
            <HobbyTags>
              <Card
                active={selected === "all"}
                onClick={() => {
                  setQuery("");
                  setSelected("all");
                  dispatch({ type: "reset" });
                }}
              >
                全部
              </Card>
              {hobbies.map((hobby) => (
                <HobbyCard
                  key={hobby.name}
                  name={hobby.name}
                  selected={selected}
                  setSelected={setSelected}
                  setLoading={setSearching}
                  dispatch={dispatch}
                  filterData={filterData}
                />
              ))}
            </HobbyTags>
            <ResultDisplayer>
              {searching
                ? Array.from(Array(6).keys()).map((number) => (
                    <Skeleton
                      key={number}
                      height={250}
                      borderRadius={20}
                      style={{ marginBottom: "20px" }}
                    />
                  ))
                : filterData.allUsers.filter(filterFunction).length
                ? filterData.allUsers
                    .filter(filterFunction)
                    .slice(0, filterData.usersPerPage * filterData.currentPage)
                    .map((user) => <UserCard key={user.uid} user={user} />)
                : "查無用戶"}
            </ResultDisplayer>
            <Anchor ref={anchor}></Anchor>
          </NewWrapper>
          <Footer />
        </>
      );
    }
    if (error) {
      return <>Oops! 看來出了一點問題，請稍後再試</>;
    }
    return <Navigate replace to="/" />;
  }

  return Render();
}

export default Community;
