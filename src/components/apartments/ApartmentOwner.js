import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import api from "../../utils/api";

import {
  MediumTitle,
  FlexWrapper,
  Bold,
  Button1,
  ProfileImage,
} from "../common/Components";
import SignInFirstModal from "../modals/SignInFirst";
import SendMessageModal from "../modals/SendMessage";
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
  const [ownerInfo, setOwnerInfo] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getDataWithSingleQuery("users", "uid", "==", owner).then((res) => {
      const owner = res[0];
      setOwnerInfo(owner);
    });
  }, [owner]);

  return (
    <>
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="??????????????????" />
      )}
      {openModal && (
        <SendMessageModal
          toggle={() => setOpenModal(false)}
          objectId={ownerInfo?.uid}
          successfullySaved={() => setSaved(true)}
          receiver="owner"
        />
      )}
      {openSignin && <SignInFirstModal toggle={() => setOpenSignin(false)} />}
      <Wrapper page={page}>
        {page === "apartment" && <SubTitle>????????????</SubTitle>}
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
        {ownerInfo?.uid === currentUser?.uid ? (
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
            ????????????
          </Button1>
        )}
      </Wrapper>
    </>
  );
}

OwnerCard.propTypes = {
  owner: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  page: PropTypes.string,
};
