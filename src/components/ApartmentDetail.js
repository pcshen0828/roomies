import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import Carousel from "../components/ApartmentCarousel";
import JoinConfirmModal from "./modals/joinGroupConfirm";

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

function ApartmentDetail({ uid }) {
  const { id } = useParams();
  const [details, setDetails] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);
  const [hasJoined, setHasJoined] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    async function getDetailData() {
      if (!mounted) return;
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "apartments"),
        Firebase.where("id", "==", id)
      );
      const querySnapShot = await Firebase.getDocs(query);
      const detail = querySnapShot.docs.map((doc) => doc.data());
      setDetails(detail);
    }

    async function checkHasJoinedGroupOrNot() {
      if (!mounted) return;
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "groups"),
        Firebase.where("apartmentId", "==", id)
      );
      const querySnapShot = await Firebase.getDocs(query);
      const groupData = querySnapShot.docs.map((doc) => doc.data())[0];
      setHasJoined(groupData.members.includes(uid));
    }
    getDetailData();
    if (uid) {
      checkHasJoinedGroupOrNot();
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function openConfirmModal() {
    if (!uid) {
      // 如果沒有登入的話，請先登入
      // fix me
      console.log("未登入");
      return;
    }
    setIsActive(true);
  }

  return (
    <>
      {isActive && (
        <JoinConfirmModal
          apartmentId={details[0].id}
          setIsActive={setIsActive}
          uid={uid}
        />
      )}
      <Head>
        <Carousel id={id} />
        {details.length && (
          <DetailInfo>
            <Title>{details[0].title}</Title>
            {hasJoined ? (
              <StyledLink to="/groups">查看社團</StyledLink>
            ) : (
              <button onClick={openConfirmModal}>加入租屋</button>
            )}
          </DetailInfo>
        )}
      </Head>
    </>
  );
}

export default ApartmentDetail;
