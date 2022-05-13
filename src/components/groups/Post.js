import React from "react";
import styled from "styled-components";
import api from "../../utils/api";
import {
  Bold,
  FlexColumn,
  FlexWrapper,
  ProfileImage,
} from "../common/Components";
import { calcTimeGap } from "../../utils/calculate";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  background: #fff;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
`;

const NewProfile = styled(ProfileImage)`
  width: 45px;
  height: 45px;
  margin-right: 10px;
`;

const TopInfo = styled(FlexWrapper)`
  width: calc(100% - 40px);
  padding: 20px;
`;

const NameTime = styled(FlexColumn)`
  align-items: flex-start;
`;

const SubtitleSmall = styled.div`
  font-size: 14px;
  color: #a1aeb7;
`;

const Content = styled.div`
  width: calc(100% - 40px);
  padding: 0 0 20px;
`;

const SinglemageDisplayer = styled.img`
  width: 100%;
  height: auto;
  border: 1px solid #e8e8e8;
  ${
    "" /* background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
  }
`;

const MediumImageDisplayer = styled(FlexWrapper)``;

const MultiImageDisplayer = styled(FlexColumn)``;

export default function Post({ post }) {
  const [creatorInfo, setCreatorInfo] = React.useState({});

  React.useEffect(() => {
    api
      .getDataWithSingleQuery("users", "uid", "==", post.creator)
      .then((res) => {
        setCreatorInfo(res[0]);
      });
  }, []);
  return (
    <Wrapper>
      <TopInfo>
        <NewProfile src={creatorInfo.profileImage} />
        <NameTime>
          <Bold>{creatorInfo.alias}</Bold>
          <SubtitleSmall>{calcTimeGap(post.updateTime.toDate())}</SubtitleSmall>
        </NameTime>
      </TopInfo>
      <Content>{post.content}</Content>
      {post.images.length
        ? post.images.map((image) =>
            post.images.length === 1 ? (
              <SinglemageDisplayer src={image.url} />
            ) : post.images.length <= 3 ? (
              <MediumImageDisplayer></MediumImageDisplayer>
            ) : post.images.length > 3 ? (
              <MultiImageDisplayer></MultiImageDisplayer>
            ) : (
              ""
            )
          )
        : ""}
    </Wrapper>
  );
}
