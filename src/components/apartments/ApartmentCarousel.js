import React from "react";
import styled from "styled-components";
import api from "../../utils/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./carousel.css";

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

const Image = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

function Carousel({ id }) {
  const [images, setImages] = React.useState([]);
  const [cover, setCover] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    api.getDataWithSingleQuery("apartments", "id", "==", id).then((res) => {
      if (!mounted) return;
      setImages(res[0].images);
      setCover(res[0].coverImage);
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

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

export default Carousel;
