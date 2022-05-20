import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CloseButton, Overlay } from "../modals/ModalElements";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

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

export default function ImagesDisplayer({ images, toggle }) {
  return (
    <NewOverlay
      onClick={() => {
        toggle();
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

ImagesDisplayer.propTypes = {
  images: PropTypes.array,
  toggle: PropTypes.func,
};
