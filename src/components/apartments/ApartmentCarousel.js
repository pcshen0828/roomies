import React from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import switcher from "../../images/send.svg";
import api from "../../utils/api";

const Wrapper = styled.div`
  width: calc(55% - 20px);
  height: 450px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  max-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
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

  React.useEffect(() => {
    let mounted = true;
    async function getImages() {
      if (!mounted) return;
      const subColRef = Firebase.collection(
        Firebase.db,
        "apartments",
        id,
        "images"
      );
      const qSnap = await Firebase.getDocs(subColRef);
      setImages(qSnap.docs.map((doc) => doc.data().url));
    }
    getImages();

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
      {images.length &&
        images.map((image, index) => <Image src={image} key={index} />)}
    </Wrapper>
  );
}

export default Carousel;
