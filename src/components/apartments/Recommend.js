import React from "react";
import styled from "styled-components";
import Card from "./ApartmentCard";
import { Firebase } from "../../utils/firebase";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "./carousel.css";

const Wrapper = styled(Swiper)`
  width: 100%;
  @media screen and (max-width: 1279.98px) {
    margin-bottom: 20px;
  }
`;

const StyledCard = styled(Card)`
  width: 350px;
  height: 420px;
  @media screen and (max-width: 1279.98px) {
    width: calc((100% - 10px) / 2));
  }

  @media screen and (max-width: 600px) {
    width: 90%;
  }
`;

function RecommendCarousel({ id }) {
  const [apartments, setApartments] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;

    async function getRecommedItems() {
      const query = Firebase.query(
        Firebase.collection(Firebase.db, "apartments"),
        Firebase.where("id", "!=", id),
        Firebase.where("status", "==", 1),
        Firebase.limit(10)
      );
      const querySnapShot = await Firebase.getDocs(query);
      const result = querySnapShot.docs.map((doc) => doc.data());
      if (!mounted) return;
      setApartments(result);
    }
    getRecommedItems();

    return function cleanup() {
      mounted = false;
    };
  }, [id]);

  return (
    <Wrapper
      modules={[Navigation, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      rewind={true}
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }}
    >
      {apartments &&
        apartments.map((apartment) => (
          <SwiperSlide key={apartment.id}>
            <StyledCard detail={apartment} />
          </SwiperSlide>
        ))}
    </Wrapper>
  );
}

export default RecommendCarousel;
