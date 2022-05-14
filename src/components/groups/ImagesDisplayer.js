import React from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../apartments/carousel.css";
import { CloseButton, Overlay } from "../modals/ModalElements";

const NewOverlay = styled(Overlay)`
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
`;

const Container = styled.div`
  width: 70%;
  max-width: 700px;
  @media screen and (max-width: 767.98px) {
    width: 90%;
  }
`;

const Wrapper = styled(Swiper)`
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  height: 80vh;
`;

export default function ImagesDisplayer({ images, index, toggle }) {
  console.log("yes");
  return (
    <NewOverlay
      onClick={() => {
        toggle(false);
      }}
    >
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton>×</CloseButton>
        <Wrapper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          rewind={true}
        >
          {images.map((image) => (
            <SwiperSlide key={image.url}>
              <Image src={image.url} />
            </SwiperSlide>
          ))}
        </Wrapper>
      </Container>
    </NewOverlay>
  );
}
