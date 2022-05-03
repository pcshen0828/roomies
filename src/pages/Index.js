import React from "react";
import styled from "styled-components";
import {
  Button1,
  FlexWrapper,
  StyledLink,
} from "../components/common/Components";
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
import SignUpModal from "../components/modals/SignUp";

const banners = [banner5, banner1, banner3, banner2, banner4];

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  margin-bottom: 40px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  @media screen and (max-width: 767.98px) {
    height: 400px;
  }
`;

const BannerWrapper = styled(Swiper)`
  width: 55%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  @media screen and (max-width: 767.98px) {
    width: 100%;
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

const InnerWrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  height: 100%;
  flex-direction: column;
  max-width: 1200px;
  margin: 0px auto;
  position: relative;
`;

const IntroWrapper = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  left: 0;
  top: 170px;
  @media screen and (max-width: 767.98px) {
    position: absolute;
    z-index: 10;
    left: -24px;
    top: 150px;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px 60px 20px 20px;
  }
`;

const Intro = styled.div`
  font-size: 32px;
  font-family: "Noto Serif TC", serif;
  margin-bottom: 10px;
  @media screen and (max-width: 767.98px) {
    font-size: 24px;
  }
`;

const ActionButtons = styled(FlexWrapper)`
  margin-top: 40px;
  justify-content: space-between;
  width: 240px;
`;

const IntroBanner = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 20px auto 40px;
  height: 400px;
  border: 1px solid red;
`;

function Index() {
  const [openSignup, setOpenSignUp] = React.useState(false);
  return (
    <>
      <Wrapper>
        {openSignup && <SignUpModal setOpenSignUp={setOpenSignUp} />}
        <InnerWrapper>
          <IntroWrapper>
            <Intro>寓見 Roomies</Intro>｜單層公寓合租平台
            <ActionButtons>
              <Button1 onClick={() => setOpenSignUp(true)}>立即註冊</Button1>
              <StyledLink to="/apartments">查看所有房源</StyledLink>
            </ActionButtons>
          </IntroWrapper>
        </InnerWrapper>
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
      <IntroBanner></IntroBanner>
    </>
  );
}

export default Index;
