import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import Carousel from "./ApartmentCarousel";
import JoinConfirmModal from "../modals/JoinGroupConfirm";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import SignInFirstModal from "../modals/SignInFirst";
import OwnerCard from "./ApartmentOwner";
import { Button1, FlexWrapper, Title } from "../common/Components";
import ApartmentMap from "./ApartmentMap";
import RecommendCarousel from "./Recommend";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// icons
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
  min-height: calc(100vh - 441px);
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

const DetailInfo = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

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
  align-itmes: center;
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

const BodyLeft = styled(FlexWrapper)`
  width: calc(60% - 30px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  const [isActive, setIsActive] = React.useState(false);
  const [hasJoined, setHasJoined] = React.useState(false);
  const [groupId, setGroupId] = React.useState();
  const [hasNotSignIn, setHasNotSignIn] = React.useState(false);
  const [conditions, setConditions] = React.useState([]);
  const [facilities, setFacilities] = React.useState([]);
  const [furnitures, setFurnitures] = React.useState([]);
  const [otherInfo, setOtherInfo] = React.useState([]);
  const [membersCount, setMembersCount] = React.useState("");

  const queryList = [
    { name: "conditions", method: (res) => setConditions(res) },
    { name: "facilities", method: (res) => setFacilities(res) },
    { name: "furnitures", method: (res) => setFurnitures(res) },
    { name: "otherInfo", method: (res) => setOtherInfo(res) },
  ];

  React.useEffect(() => {
    let mounted = true;
    queryList.forEach((subcollection) => {
      api
        .getAllDocsFromCollection("apartments/" + id + `/${subcollection.name}`)
        .then((res) => {
          if (!mounted) return;
          subcollection.method(res);
        });
    });

    function checkHasJoinedGroupOrNot() {
      if (!mounted) return;
      api
        .getDataWithSingleQuery("groups", "apartmentId", "==", id)
        .then((res) => {
          if (res.length) {
            setGroupId(res[0].id);
            setHasJoined(res[0].members?.includes(currentUser.uid));
            setMembersCount(res[0].members.length);
          }
        });
    }

    if (currentUser) {
      checkHasJoinedGroupOrNot();
    }

    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

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

  return (
    <>
      {hasNotSignIn && <SignInFirstModal setToggle={setHasNotSignIn} />}
      {isActive && (
        <JoinConfirmModal
          setIsActive={setIsActive}
          apartmentId={details[0].id}
          groupId={groupId}
        />
      )}
      {loading ? (
        <Wrapper>
          <Head>
            {matchMedia("(max-width: 1280px)").matches ? (
              <div style={{ width: "100%" }}>
                <Skeleton
                  width="100%"
                  inline={true}
                  height={300}
                  style={{ marginRight: "10px" }}
                />
                <Skeleton width="100%" height={40} count={3} inline={false} />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "57%" }}>
                  <Skeleton width="100%" inline={true} height={420} />
                </div>
                <div style={{ width: "40%" }}>
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
                </div>
              </div>
            )}
          </Head>
        </Wrapper>
      ) : details.length ? (
        <Wrapper>
          <Head>
            <Carousel id={id} />
            {details.length && (
              <DetailInfo>
                <Title>{details[0].title}</Title>
                <Details>
                  <Detail>
                    <DetailIcon src={calendar} alt="" />
                    發佈於{" "}
                    {new Date(details[0].createTime.toDate())
                      .toLocaleString()
                      .slice(0, -3)}
                  </Detail>
                  <Detail>
                    <DetailIcon src={loc} alt="" />
                    {details[0].address}
                    {otherInfo.find((item) => item.id === "floor")?.value}樓
                  </Detail>
                  <Detail>
                    <DetailIcon src={square} alt="" />
                    坪數{" "}
                    {
                      otherInfo.find((item) => item.id === "squareFeet")?.value
                    }{" "}
                    坪
                  </Detail>
                  <Detail>
                    <DetailIcon src={members} alt="" />
                    房客 {details[0].roomiesCount} 人
                  </Detail>
                  <Detail>
                    <DetailIcon src={room} alt="" />
                    房數 {details[0].rooms} 間
                  </Detail>
                  <Detail>
                    <DetailIcon src={rent} alt="" />
                    每月房租 NTD.
                    <RentPrice>
                      {details[0].monthlyRent.toLocaleString(2)}
                    </RentPrice>{" "}
                    / 間
                  </Detail>
                </Details>
                {details[0].status === 0 ? (
                  ""
                ) : currentUser &&
                  currentUser.role === 2 &&
                  details[0].owner === currentUser.uid ? (
                  <ActionArea>
                    <StyledLink to={`/groups/${groupId}`}>查看社團</StyledLink>
                    <MembersCount>{membersCount}人已加入</MembersCount>
                  </ActionArea>
                ) : currentUser &&
                  currentUser.role === 2 &&
                  details[0].owner !== currentUser.uid ? (
                  ""
                ) : (
                  <ActionArea>
                    {hasJoined ? (
                      <StyledLink to={`/groups/${groupId}`}>
                        查看社團
                      </StyledLink>
                    ) : (
                      <Button1 onClick={openConfirmModal}>加入租屋</Button1>
                    )}
                    <MembersCount>{membersCount}人已加入</MembersCount>
                  </ActionArea>
                )}
              </DetailInfo>
            )}
          </Head>

          <Body>
            <BodyLeft>
              <SubTitle>房源簡介</SubTitle>
              <DescriptionWrapper>
                {otherInfo.find((item) => item.id === "feature")?.value}
              </DescriptionWrapper>
              <SubTitle>設施條件</SubTitle>
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
              <SubTitle>室內設備</SubTitle>
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
              <SubTitle>家具</SubTitle>
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
              <SubTitle>其他資訊</SubTitle>
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
                        ? "是"
                        : item.value === false
                        ? "否"
                        : item.id === "depositMonth"
                        ? `${item.value}個月`
                        : item.value}
                    </OtherInfo>
                  ))}
              </DescriptionWrapper>
            </BodyLeft>
            <OwnerCard
              owner={details[0].owner}
              currentUser={currentUser}
              page="apartment"
            />
          </Body>
          <SubTitle>地圖位置</SubTitle>
          <ApartmentMap geoLocation={details[0].geoLocation} />
          <SubTitle>你可能也會喜歡：</SubTitle>
          <RecommendCarousel id={details[0].id} />
        </Wrapper>
      ) : (
        <>無此房源</>
      )}
    </>
  );
}

export default ApartmentDetail;
