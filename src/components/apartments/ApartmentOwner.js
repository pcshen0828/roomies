import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../utils/api";

import {
  MediumTitle,
  FlexWrapper,
  Bold,
  Button1,
  ProfileImage,
} from "../common/Components";
import SendMessageLandlordModal from "../modals/SendMessageLandlord";
import SignInFirstModal from "../modals/SignInFirst";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import phone from "../../images/phone.svg";

const Wrapper = styled(FlexWrapper)`
  width: ${(props) =>
    props.page === "apartment" ? "calc(40% - 60px)" : "calc(100% - 42px)"};
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  flex-direction: column;
  align-items: flex-start;
  padding: ${(props) =>
    props.page === "apartment" ? "30px 30px 40px" : "20px"};

  @media screen and (max-width: 1279.98px) {
    width: ${(props) =>
      props.page === "apartment" ? "calc(100% - 60px)" : "calc(100% - 42px)"};
    margin-bottom: 20px;
  }
`;

const SubTitle = styled.div`
  width: 300px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const NewProfileImage = styled(ProfileImage)`
  width: ${(props) => (props.page === "apartment" ? "90px" : "60px")};
  height: ${(props) => (props.page === "apartment" ? "90px" : "60px")};
  margin-right: 10px;
  flex-shrink: 0;
`;

const Info = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
`;

const Intro = styled.div`
  margin: 20px 0;
  font-size: ${(props) => (props.page === "apartment" ? "16px" : "14px")};
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 6px;
`;

export default function OwnerCard({ owner, currentUser, page }) {
  const [ownerInfo, setOwnerInfo] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getDataWithSingleQuery("users", "uid", "==", owner).then((res) => {
      setOwnerInfo(res[0]);
    });
  }, []);

  return (
    <>
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="訊息已發送！" />
      )}
      {openModal && (
        <SendMessageLandlordModal
          setOpenModal={setOpenModal}
          objectId={ownerInfo.uid}
          setSaved={setSaved}
        />
      )}
      {openSignin && <SignInFirstModal setToggle={setOpenSignin} />}
      <Wrapper page={page}>
        {page === "apartment" && <SubTitle>屋主資訊</SubTitle>}
        {ownerInfo && (
          <>
            <FlexWrapper>
              <NewProfileImage src={ownerInfo.profileImage} page={page} />
              <Info>
                <MediumTitle>{ownerInfo.alias}</MediumTitle>
                <FlexWrapper>
                  <Icon alt="" src={phone} />
                  <Bold>{ownerInfo.phone}</Bold>
                </FlexWrapper>
              </Info>
            </FlexWrapper>
            <Intro>{ownerInfo.selfIntro}</Intro>
          </>
        )}
        {ownerInfo && ownerInfo.uid === currentUser.uid ? (
          ""
        ) : (
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
        )}
      </Wrapper>
    </>
  );
}
