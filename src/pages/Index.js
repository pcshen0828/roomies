import React from "react";
import styled from "styled-components";
import { FlexWrapper } from "../components/common/Components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import banner1 from "../images/banner1.png";
import banner2 from "../images/banner2.png";
import banner3 from "../images/banner3.png";
import banner4 from "../images/banner4.png";
import banner5 from "../images/banner5.png";

const banners = [banner5, banner1, banner3, banner2, banner4];

const Wrapper = styled(FlexWrapper)`
  width: 100%;
  height: 450px;
  position: relative;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

const BannerWrapper = styled(Swiper)`
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  @media screen and (max-width: 767.98px) {
    width: 100%;
    height: 90%;
  }
`;

const Banner = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const IntroWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: 50%;
`;

const Intro = styled.div`
  font-size: 32px;
  font-family: "Noto Serif TC", serif;
  margin-bottom: 10px;
`;

function Index() {
  return (
    <Wrapper>
      <IntroWrapper>
        <Intro>寓見 Roomies</Intro>｜單層公寓合租平台
      </IntroWrapper>
      <BannerWrapper
        modules={[Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        rewind={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
      >
        {banners.map((image, index) => (
          <SwiperSlide key={image}>
            <Banner src={image} />
          </SwiperSlide>
        ))}
      </BannerWrapper>
    </Wrapper>
  );
}

export default Index;
