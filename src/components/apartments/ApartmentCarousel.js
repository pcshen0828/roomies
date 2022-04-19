import React from "react";
import styled from "styled-components";
import switcher from "../../images/send.svg";
import api from "../../utils/api";
import { useParams } from "react-router-dom";

const Wrapper = styled.div`
  width: calc(55% - 20px);
  height: 450px;
  overflow: hidden;
  position: relative;
  @media screen and (max-width: 1279.98px) {
    width: 100%;
    height: 300px;
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
const ImageSwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  z-index: 10;
  width: 100%;
  bottom: 48%;
`;

const defaultStyle = `
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Prev = styled.img`
  ${defaultStyle}
`;

const Next = styled.img`
  ${defaultStyle}
`;

function Carousel({ id }) {
  const [images, setImages] = React.useState([]);
  const [cover, setCover] = React.useState("");

  React.useEffect(() => {
    console.log(id);
    let mounted = true;
    api.getDataWithSingleQuery("apartments", "id", "==", id).then((res) => {
      if (!mounted) return;
      setImages(res[0].images);
      setCover(res[0].coverImage);
      console.log(res);
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <Wrapper>
      <ImageSwitcher>
        <Prev src={switcher} onClick={() => {}} />
        <Next src={switcher} onClick={() => {}} />
      </ImageSwitcher>
      {images &&
        images.map((image, index) => <Image src={image.url} key={index} />)}
      <Image src={cover} />
    </Wrapper>
  );
}

export default Carousel;
