import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

import Skeleton from "react-loading-skeleton";
import CompleteProfileBeforeJoinModal from "../modals/CompleteProfileBeforeJoin";

import {
  Button1,
  FlexColumn,
  FlexWrapper,
  SkeletonWrapper,
  SkeletonWrapperFlex,
  SkeletonWrapperWidth,
  Title,
} from "../common/Components";
import Carousel from "./ApartmentCarousel";
import OwnerCard from "./ApartmentOwner";
import ApartmentMap from "./ApartmentMap";
import RecommendCarousel from "./Recommend";
import JoinConfirmModal from "../modals/JoinGroupConfirm";
import SignInFirstModal from "../modals/SignInFirst";

import loc from "../../images/loc.svg";
import calendar from "../../images/calendar.svg";
import members from "../../images/members.svg";
import rent from "../../images/rent.svg";
import room from "../../images/room.svg";
import square from "../../images/square.svg";

import bed from "../../images/bed.svg";
import chair from "../../images/chair.svg";
import closet from "../../images/closet.svg";
import table from "../../images/table.svg";
import sofa from "../../images/sofa.svg";

import balcony from "../../images/balcony.svg";
import parking from "../../images/parking.svg";
import guard from "../../images/guard.svg";
import pet from "../../images/pet.svg";
import garbageManagement from "../../images/garbageManagement.svg";
import elevator from "../../images/elevator.svg";

import waterHeater from "../../images/waterHeater.svg";
import naturalGas from "../../images/naturalGas.svg";
import payCable from "../../images/payCable.svg";
import airCon from "../../images/airCon.svg";
import fridge from "../../images/fridge.svg";
import kitchen from "../../images/kitchen.svg";
import wifi from "../../images/wifi.svg";
import laundry from "../../images/laundry.svg";
import { FooterHeight, HeaderHeight } from "../../styles/GlobalStyle";

const icons = [
  { name: "bed", src: bed },
  { name: "chair", src: chair },
  { name: "closet", src: closet },
  { name: "table", src: table },
  { name: "sofa", src: sofa },
  { name: "balcony", src: balcony },
  { name: "parking", src: parking },
  { name: "guard", src: guard },
  { name: "pet", src: pet },
  { name: "garbageManagement", src: garbageManagement },
  { name: "elevator", src: elevator },
  { name: "waterHeater", src: waterHeater },
  { name: "naturalGas", src: naturalGas },
  { name: "airCon", src: airCon },
  { name: "payCable", src: payCable },
  { name: "fridge", src: fridge },
  { name: "kitchen", src: kitchen },
  { name: "wifi", src: wifi },
  { name: "laundry", src: laundry },
];

const Wrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
  margin: 20px auto;
  flex-direction: column;
  align-items: flex-start;
`;

const Head = styled(FlexWrapper)`
  width: 100%;
  margin: 20px auto;
  justify-content: space-between;
  align-items: flex-start;

  @media screen and (max-width: 1279.98px) {
    flex-direction: column;
  }
`;

const DetailInfo = styled(FlexColumn)`
  width: 40%;

  @media screen and (max-width: 1279.98px) {
    width: 100%;
  }
`;

const SubTitle = styled.div`
  width: 300px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
  background: #424b5a;
  width: 120px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #c1b18a;
  }
`;

const Details = styled(FlexWrapper)`
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
`;

const Detail = styled(FlexWrapper)`
  color: #8c8989;
  align-items: center;
  min-height: 35px;
`;

const DetailIcon = styled.img`
  width: 16px;
  height: 20px;
  margin-right: 8px;
`;

const RentPrice = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #f9b50c;
  padding: 0 5px 5px;
`;

const ActionArea = styled(FlexWrapper)`
  margin-top: 20px;
`;

const MembersCount = styled(FlexWrapper)`
  align-items: center;
  margin-left: 20px;
`;

const Body = styled(FlexWrapper)`
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px auto 0;

  @media screen and (max-width: 1279.98px) {
    flex-direction: column;
  }
`;

const BodyLeft = styled(FlexColumn)`
  width: calc(60% - 30px);
  @media screen and (max-width: 1279.98px) {
    width: 100%;
  }
`;

const DescriptionWrapper = styled(FlexWrapper)`
  flex-wrap: wrap;
  margin-bottom: 30px;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #dadada;
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  flex-direction: column;
  align-items: flex-start;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const ConditionWrapper = styled(FlexWrapper)`
  align-items: center;
  margin: 0 10px 20px 0;
  width: 130px;
`;

const OtherInfo = styled.div`
  margin-bottom: 10px;
`;

function ApartmentDetail({ details, loading }) {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [isActive, setIsActive] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [groupId, setGroupId] = useState();
  const [hasNotSignIn, setHasNotSignIn] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [furnitures, setFurnitures] = useState([]);
  const [otherInfo, setOtherInfo] = useState([]);
  const [membersCount, setMembersCount] = useState();
  const [openWarning, setOpenWarning] = useState(false);

  const queryList = [
    { name: "conditions", method: (res) => setConditions(res) },
    { name: "facilities", method: (res) => setFacilities(res) },
    { name: "furnitures", method: (res) => setFurnitures(res) },
    { name: "otherInfo", method: (res) => setOtherInfo(res) },
  ];

  useEffect(() => {
    let mounted = true;
    queryList.forEach((subcollection) => {
      api
        .getAllDocsFromCollection("apartments/" + id + `/${subcollection.name}`)
        .then((docs) => {
          if (!mounted) return;
          subcollection.method(docs);
        });
    });

    function checkHasJoinedGroupOrNot() {
      if (!mounted) return;
      api
        .getDataWithSingleQuery("groups", "apartmentId", "==", id)
        .then((groups) => {
          if (groups.length) {
            const group = groups[0];
            setGroupId(group.id);
            setHasJoined(group.members?.includes(currentUser?.uid));
            setMembersCount(group.members?.length);
          }
        });
    }

    checkHasJoinedGroupOrNot();

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser, id]);

  function openConfirmModal() {
    if (!currentUser) {
      setHasNotSignIn(true);
      return;
    }
    setIsActive(true);
  }

  function getImageIcon(variable) {
    return icons.find((icon) => icon.name === variable).src;
  }

  function checkUserProfileBeforeJoinGroup() {
    if (currentUser) {
      if (
        !currentUser.hobbies.length ||
        !currentUser.jobTitle ||
        !currentUser.alias ||
        currentUser.status === 0
      ) {
        setOpenWarning(true);
        return;
      }
    }
    openConfirmModal();
  }

  return (
    <>
      {hasNotSignIn && (
        <SignInFirstModal toggle={() => setHasNotSignIn(false)} />
      )}
      {isActive && (
        <JoinConfirmModal
          toggle={() => setIsActive(false)}
          apartmentId={details.id}
          groupId={groupId}
        />
      )}
      {openWarning && (
        <CompleteProfileBeforeJoinModal toggle={() => setOpenWarning(false)} />
      )}
      {loading ? (
        <Wrapper>
          <Head>
            {matchMedia("(max-width: 1280px)").matches ? (
              <SkeletonWrapper>
                <Skeleton
                  width="100%"
                  inline={true}
                  height={300}
                  style={{ marginRight: "10px" }}
                />
                <Skeleton width="100%" height={40} count={3} inline={false} />
              </SkeletonWrapper>
            ) : (
              <SkeletonWrapperFlex>
                <SkeletonWrapperWidth width="57%">
                  <Skeleton width="100%" inline={true} height={420} />
                </SkeletonWrapperWidth>
                <SkeletonWrapperWidth width="40%">
                  <Skeleton
                    width="100%"
                    height={40}
                    count={5}
                    style={{ marginBottom: "10px" }}
                  />
                  <Skeleton
                    width={120}
                    height={60}
                    count={2}
                    inline={true}
                    style={{ margin: "60px 10px 0 0" }}
                  />
                </SkeletonWrapperWidth>
              </SkeletonWrapperFlex>
            )}
          </Head>
        </Wrapper>
      ) : details ? (
        <Wrapper>
          <Head>
            <Carousel id={id} />
            <DetailInfo>
              <Title>{details.title}</Title>
              <Details>
                <Detail>
                  <DetailIcon src={calendar} alt="" />
                  ?????????{" "}
                  {new Date(details.createTime.toDate())
                    .toLocaleString()
                    .slice(0, -3)}
                </Detail>
                <Detail>
                  <DetailIcon src={loc} alt="" />
                  {details.address}
                  {otherInfo.find((item) => item.id === "floor")?.value}???
                </Detail>
                <Detail>
                  <DetailIcon src={square} alt="" />
                  ??????{" "}
                  {otherInfo.find((item) => item.id === "squareFeet")?.value} ???
                </Detail>
                <Detail>
                  <DetailIcon src={members} alt="" />
                  ?????? {details.roomiesCount} ???
                </Detail>
                <Detail>
                  <DetailIcon src={room} alt="" />
                  ?????? {details.rooms} ???
                </Detail>
                <Detail>
                  <DetailIcon src={rent} alt="" />
                  ???????????? NTD.
                  <RentPrice>
                    {details.monthlyRent.toLocaleString(2)}
                  </RentPrice>{" "}
                  / ???
                </Detail>
              </Details>
              {details.status === 0 ? (
                ""
              ) : currentUser &&
                currentUser.role === 2 &&
                details.owner === currentUser.uid ? (
                <ActionArea>
                  <StyledLink to={`/groups/${groupId}`}>????????????</StyledLink>
                  <MembersCount>
                    {membersCount ? `${membersCount}????????????` : "????????????"}
                  </MembersCount>
                </ActionArea>
              ) : currentUser &&
                currentUser.role === 2 &&
                details.owner !== currentUser.uid ? (
                ""
              ) : (
                <ActionArea>
                  {hasJoined ? (
                    <StyledLink to={`/groups/${groupId}`}>????????????</StyledLink>
                  ) : (
                    <Button1 onClick={checkUserProfileBeforeJoinGroup}>
                      ????????????
                    </Button1>
                  )}
                  <MembersCount>
                    {membersCount ? `${membersCount}????????????` : "????????????"}
                  </MembersCount>
                </ActionArea>
              )}
            </DetailInfo>
          </Head>

          <Body>
            <BodyLeft>
              <SubTitle>????????????</SubTitle>
              <DescriptionWrapper>
                {otherInfo.find((item) => item.id === "feature")?.value}
              </DescriptionWrapper>
              <SubTitle>????????????</SubTitle>
              <DescriptionWrapper>
                {conditions
                  .filter((condition) => condition.value === true)
                  .map((item) => (
                    <ConditionWrapper key={item.id}>
                      <Icon src={getImageIcon(item.id)} />
                      {item.name}
                    </ConditionWrapper>
                  ))}
              </DescriptionWrapper>
              <SubTitle>????????????</SubTitle>
              <DescriptionWrapper>
                {facilities
                  .filter((condition) => condition.value === true)
                  .map((item) => (
                    <ConditionWrapper key={item.id}>
                      <Icon src={getImageIcon(item.id)} />
                      {item.name}
                    </ConditionWrapper>
                  ))}
              </DescriptionWrapper>
              <SubTitle>??????</SubTitle>
              <DescriptionWrapper>
                {furnitures
                  .filter((condition) => condition.value === true)
                  .map((item) => (
                    <ConditionWrapper key={item.id}>
                      <Icon src={getImageIcon(item.id)} />
                      {item.name}
                    </ConditionWrapper>
                  ))}
              </DescriptionWrapper>
              <SubTitle>????????????</SubTitle>
              <DescriptionWrapper column={true}>
                {otherInfo
                  .filter(
                    (info) =>
                      info.id !== "feature" &&
                      info.id !== "squareFeet" &&
                      info.id !== "floor"
                  )
                  .map((item) => (
                    <OtherInfo key={item.id}>
                      {item.name}:{" "}
                      {item.value === true
                        ? "???"
                        : item.value === false
                        ? "???"
                        : item.id === "depositMonth"
                        ? item.value
                        : item.value}
                    </OtherInfo>
                  ))}
              </DescriptionWrapper>
            </BodyLeft>
            <OwnerCard
              owner={details.owner}
              currentUser={currentUser}
              page="apartment"
            />
          </Body>
          <SubTitle>????????????</SubTitle>
          <ApartmentMap geoLocation={details.geoLocation} />
          <SubTitle>????????????????????????</SubTitle>
          <RecommendCarousel id={details.id} />
        </Wrapper>
      ) : (
        <>????????????</>
      )}
    </>
  );
}

ApartmentDetail.propTypes = {
  details: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ApartmentDetail;
