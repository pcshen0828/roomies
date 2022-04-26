import React from "react";
import styled from "styled-components";
import { FlexWrapper, Bold } from "../common/Components";
import api from "../../utils/api";

const Wrapper = styled(FlexWrapper)`
  width: calc(40% - 40px);
  height: 300px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
`;

const SubTitle = styled.div`
  width: 300px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const ProfileImage = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export default function OwnerCard({ owner }) {
  const [ownerInfo, setOwnerInfo] = React.useState();
  React.useEffect(() => {
    api.getDataWithSingleQuery("users", "uid", "==", owner).then((res) => {
      console.log(res[0]);
      setOwnerInfo(res[0]);
    });
  }, []);
  return (
    <Wrapper>
      <SubTitle>屋主資訊</SubTitle>
      {ownerInfo && (
        <FlexWrapper>
          <ProfileImage src={ownerInfo.profileImage} />
        </FlexWrapper>
      )}
    </Wrapper>
  );
}
