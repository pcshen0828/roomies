import React from "react";
import styled from "styled-components";
import {
  MediumTitle,
  FlexWrapper,
  Bold,
  Button1,
  StyledLink,
} from "../common/Components";
import api from "../../utils/api";
import SendMessageLandlordModal from "../modals/SendMessageLandlord";
import phone from "../../images/phone.svg";
import SignInFirstModal from "../modals/SignInFirst";

const Wrapper = styled(FlexWrapper)`
  width: calc(40% - 60px);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 30px 40px;

  @media screen and (max-width: 1279.98px) {
    width: calc(100% - 60px);
    margin-bottom: 20px;
  }
`;

const OwnerLink = styled(StyledLink)`
  &:hover {
    border-bottom: 1px solid transparent;
    color: #c1b18a;
  }
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
  margin-right: 10px;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Info = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
`;

const Intro = styled.div`
  margin: 20px 0;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 6px;
`;

export default function OwnerCard({ owner, currentUser }) {
  const [ownerInfo, setOwnerInfo] = React.useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [openSignin, setOpenSignin] = React.useState(false);
  React.useEffect(() => {
    api.getDataWithSingleQuery("users", "uid", "==", owner).then((res) => {
      setOwnerInfo(res[0]);
    });
  }, []);

  return (
    <>
      {openModal && (
        <SendMessageLandlordModal
          setOpenModal={setOpenModal}
          objectId={ownerInfo.uid}
        />
      )}
      {openSignin && <SignInFirstModal setToggle={setOpenSignin} />}
      <Wrapper>
        <SubTitle>屋主資訊</SubTitle>
        {ownerInfo && (
          <>
            <FlexWrapper>
              <ProfileImage src={ownerInfo.profileImage} />
              <Info>
                <OwnerLink to={`/users/${ownerInfo.uid}`}>
                  <MediumTitle>{ownerInfo.alias}</MediumTitle>
                </OwnerLink>
                <FlexWrapper>
                  <Icon alt="" src={phone} />
                  <Bold>{ownerInfo.phone}</Bold>
                </FlexWrapper>
              </Info>
            </FlexWrapper>
            <Intro>{ownerInfo.selfIntro}</Intro>
          </>
        )}
        <Button1
          onClick={() => {
            if (!currentUser) {
              setOpenSignin(true);
              return;
            }
            setOpenModal(true);
          }}
        >
          發送訊息
        </Button1>
      </Wrapper>
    </>
  );
}
