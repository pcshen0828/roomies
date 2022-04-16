import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import Carousel from "./ApartmentCarousel";
import JoinConfirmModal from "../modals/JoinGroupConfirm";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import SignInFirstModal from "../modals/SignInFirst";

const Head = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  border: 1px solid red;
  display: flex;
  justify-content: space-between;
`;

const DetailInfo = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const StyledLink = styled(Link)`
  background: #424b5a;
  width: 120px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #c1b18a;
  }
`;

function ApartmentDetail() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [details, setDetails] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);
  const [hasJoined, setHasJoined] = React.useState(false);
  const [groupId, setGroupId] = React.useState();
  const [hasNotSignIn, setHasNotSignIn] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    async function getDetailData() {
      if (!mounted) return;
      api.getDataWithSingleQuery("apartments", "id", "==", id).then((res) => {
        setDetails(res);
      });
    }

    async function checkHasJoinedGroupOrNot() {
      if (!mounted) return;
      api
        .getDataWithSingleQuery("groups", "apartmentId", "==", id)
        .then((res) => {
          setGroupId(res[0].id);
          setHasJoined(res[0].members.includes(currentUser.uid));
        });
    }
    getDetailData();
    if (currentUser) {
      checkHasJoinedGroupOrNot();
    }

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

  function openConfirmModal() {
    if (!currentUser) {
      setHasNotSignIn(true);
      return;
    }
    setIsActive(true);
  }

  return (
    <>
      {hasNotSignIn && <SignInFirstModal setToggle={setHasNotSignIn} />}
      {isActive && (
        <JoinConfirmModal
          apartmentId={details[0].id}
          setIsActive={setIsActive}
          groupId={groupId}
        />
      )}
      {details.length ? (
        <Head>
          <Carousel id={id} />
          {details.length && (
            <DetailInfo>
              <Title>{details[0].title}</Title>
              {hasJoined ? (
                <StyledLink to={`/groups/${groupId}`}>查看社團</StyledLink>
              ) : (
                <button onClick={openConfirmModal}>加入租屋</button>
              )}
            </DetailInfo>
          )}
        </Head>
      ) : (
        <>無此房源</>
      )}
    </>
  );
}

export default ApartmentDetail;
