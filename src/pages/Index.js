import { useEffect, useRef, useState } from "react";
import { Firebase } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import scrollToTop from "../utils/scroll";

import styled, { keyframes } from "styled-components";
import {
  BannerTitle,
  Button1,
  FlexColumn,
  FlexWrapper,
  StyledLink,
  TitleSub,
} from "../components/common/Components";
import SignUpModal from "../components/modals/SignUp";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper";

import banner1 from "../images/banner1.png";
import banner2 from "../images/banner2.png";
import banner3 from "../images/banner3.png";
import banner4 from "../images/banner4.png";
import banner5 from "../images/banner5.png";
import mates from "../images/mates.png";
import corner from "../images/corner.png";
import down from "../images/down.svg";
import checked from "../images/checked.svg";
import { HeaderHeight } from "../styles/GlobalStyle";

const banners = [banner5, banner1, banner3, banner2, banner4];

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - ${HeaderHeight}px);
  position: relative;
  margin-bottom: 20px;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  @media screen and (max-width: 767.98px) {
    position: absolute;
    z-index: 10;
    left: -24px;
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

const Span = styled.span`
  letter-spacing: 10px;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 32px;
  @media screen and (max-width: 767.98px) {
    font-size: 24px;
  }
`;

const ActionButtons = styled(FlexWrapper)`
  margin-top: 40px;
  height: 50px;
  justify-content: space-between;
  width: 240px;
  animation: ${fadeIn} 1.5s ease-in;
`;

const DownWrapper = styled(FlexWrapper)`
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e8e8e8;
  margin-top: 60px;
  @media screen and (max-width: 767.98px) {
    margin-top: 20px;
  }
`;

const Down = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const IntroBanner = styled(FlexWrapper)`
  width: 100%;
  margin: 30px auto 40px;
  align-items: flex-start;
  flex-direction: column;
`;

const IntroCenter = styled(FlexWrapper)`
  align-items: center;
  margin: 20px auto 0;
  width: calc(100% - 48px);
  max-width: 1200px;
  height: 120px;
  @media screen and (max-width: 995.98px) {
    height: 80px;
    margin: 0 auto 20px;
  }
`;

const IntroBox = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  height: 220px;
  border: 1px solid #e8e8e8;
  margin: 0 auto 20px;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  overflow: hidden;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
    height: 350px;
  }
`;

const IntroContent = styled(FlexColumn)`
  width: calc(58% - 40px);
  align-items: flex-start;
  padding: 20px;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 40px);
    justify-content: center;
    padding-bottom: 0;
  }
`;

const IntroImage = styled.div`
  width: 40%;
  height: 100%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media screen and (max-width: 767.98px) {
    width: 100%;
  }
`;

const Text = styled.div`
  line-height: 150%;
  margin: 10px 0;
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin: 3px 5px 0 0;
`;

const SloganWrapper = styled(FlexWrapper)`
  align-items: flex-start;
`;

const CallToActionBlock = styled(FlexColumn)`
  height: 100px;
  justify-content: space-between;
  margin: 60px 0 80px;
  align-items: center;
  @media screen and (max-width: 575.98px) {
    height: 90px;
  }
`;

const slogans = [
  {
    title: "????????????????????????????????????",
    text1: "?????????????????????????????????????????????????????????????????????",
    text2: "???????????????????????????????????????????????????????????????????????????",
    src: mates,
  },
  {
    title: "??????????????????????????????????????????",
    text1: "?????????????????????????????????????????????????????????????????????",
    text2: "?????????????????????????????????????????????????????????",
    src: corner,
  },
];

function Index() {
  const auth = Firebase.getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [openSignup, setOpenSignUp] = useState(false);
  const [show, setShow] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  function RenderCTAButton(area) {
    if (loading) {
      return <Loader />;
    }
    if (user) {
      if (area === 1) {
        return (
          <>
            <Button1 onClick={() => navigate("/community")}>????????????</Button1>
            <StyledLink to="/apartments">??????????????????</StyledLink>
          </>
        );
      } else {
        return (
          <Button1 onClick={() => navigate("/apartments")}>????????????</Button1>
        );
      }
    }
    if (error) {
      return null;
    }
    return area === 1 ? (
      <>
        <Button1 onClick={() => setOpenSignUp(true)}>????????????</Button1>
        <StyledLink to="/apartments">??????????????????</StyledLink>
      </>
    ) : (
      <Button1 onClick={() => setOpenSignUp(true)}>????????????</Button1>
    );
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true);
    }, 2000);

    scrollToTop();

    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, []);

  function scrollToSloganBlock() {
    const scrollHeight = scrollRef.current.getBoundingClientRect().top;
    const headerGap = 100;
    window.scrollTo({
      top: scrollHeight - headerGap,
      behavior: "smooth",
    });
  }

  return (
    <>
      <Wrapper>
        {openSignup && <SignUpModal toggle={() => setOpenSignUp(false)} />}
        <InnerWrapper>
          <IntroWrapper>
            <Intro>
              ??????<Span> Roomies</Span>
            </Intro>
            ???????????????????????????
            <ActionButtons show={show}>{RenderCTAButton(1)}</ActionButtons>
            <DownWrapper onClick={scrollToSloganBlock}>
              <Down src={down} />
            </DownWrapper>
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
          {banners.map((image) => (
            <SwiperSlide key={image}>
              <Banner src={image} />
            </SwiperSlide>
          ))}
        </BannerWrapper>
      </Wrapper>
      <IntroBanner ref={scrollRef}>
        <IntroCenter>
          <BannerTitle>???????????????????????????????????????????????????</BannerTitle>
        </IntroCenter>

        {slogans.map((item, index) => (
          <IntroBox key={index}>
            <IntroContent>
              <TitleSub>{item.title}</TitleSub>
              <Text>
                <SloganWrapper>
                  <Icon src={checked} />
                  {item.text1}
                </SloganWrapper>
                <br />
                <SloganWrapper>
                  <Icon src={checked} />
                  {item.text2}
                </SloganWrapper>
              </Text>
              <Text></Text>
            </IntroContent>
            <IntroImage src={item.src} />
          </IntroBox>
        ))}
      </IntroBanner>
      <CallToActionBlock>
        <BannerTitle>???????????????????????????????????????</BannerTitle>
        {RenderCTAButton(2)}
      </CallToActionBlock>
      <Footer />
    </>
  );
}

export default Index;
