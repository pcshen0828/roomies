import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import api from "../../utils/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { BackgroundImage } from "../common/Components";

const Wrapper = styled(Swiper)`
  width: calc(60% - 30px);
  height: 420px;
  overflow: hidden;
  position: relative;
  @media screen and (max-width: 1279.98px) {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
`;

const Image = styled(BackgroundImage)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

function Carousel({ id }) {
  const [images, setImages] = useState([]);
  const [cover, setCover] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getDataWithSingleQuery("apartments", "id", "==", id).then((res) => {
      if (!mounted) return;
      const apartment = res[0];
      setImages(apartment.images);
      setCover(apartment.coverImage);
    });

    return function cleanup() {
      mounted = false;
    };
  }, [id]);

  return (
    <Wrapper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      rewind={true}
    >
      <SwiperSlide>
        <Image src={cover} />
      </SwiperSlide>
      {images &&
        images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image src={image.url} key={index} />
          </SwiperSlide>
        ))}
    </Wrapper>
  );
}

Carousel.propTypes = {
  id: PropTypes.string,
};

export default Carousel;
