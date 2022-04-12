import React from "react";
import styled from "styled-components";
import Carousel from "../components/ApartmentCarousel";
import { useParams } from "react-router-dom";
import { Firebase } from "../utils/firebase";

const Head = styled.div`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto;
  border: 1px solid red;
`;

function ApartmentDetail() {
  const { id } = useParams();
  const [details, setDetails] = React.useState([]);

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "apartments"),
      Firebase.where("id", "==", id)
    );
    async function getDetailData() {
      const querySnapShot = await Firebase.getDocs(query);
      const detail = querySnapShot.docs.map((doc) => doc.data());
      setDetails(detail);
    }
    getDetailData();
  }, []);
  return (
    <Head>
      <Carousel id={id} />
    </Head>
  );
}

export default ApartmentDetail;
