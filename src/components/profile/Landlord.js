import React from "react";
import styled from "styled-components";
import {
  BodyWrapper,
  ProfileList,
  ProfileItem,
  ProfileContent,
} from "../common/Components";
import LandlordInfo from "./LandlordInfo";
import LandlordProperty from "./LandlordProperty";
import LandlordSchedule from "./LandlordSchedule";
import { useNavigate, useParams } from "react-router-dom";

const Wrapper = styled(BodyWrapper)`
  margin-top: 0px;
  min-height: calc(100vh - 471px);
  @media screen and (max-width: 1279.98px) {
    flex-direction: cloumn;
    justify-content: flex-start;
    min-height: calc(100vh - 431px);
  }
`;

const profilelist = [
  {
    name: "會員基本資料",
    id: 1,
    to: "/profile/info",
    component: <LandlordInfo key="1" />,
  },
  {
    name: "房源管理",
    id: 2,
    to: "/profile/apartments",
    component: <LandlordProperty key="2" />,
  },
  {
    name: "行程管理",
    id: 3,
    to: "/profile/schedule",
    component: <LandlordSchedule key="3" />,
  },
];

function Landlord() {
  const [listIndex, setListIndex] = React.useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    const current = profilelist.find((item) => item.to === `/profile/${id}`);
    setListIndex(current && current.id);
  }, [id]);

  return (
    <Wrapper>
      <ProfileList>
        {profilelist.map((item, index) => (
          <ProfileItem
            key={index}
            active={listIndex === item.id}
            onClick={() => {
              setListIndex(item.id);
              navigate(item.to);
            }}
          >
            {item.name}
          </ProfileItem>
        ))}
      </ProfileList>
      {listIndex && (
        <ProfileContent>
          {profilelist.map((item) => listIndex === item.id && item.component)}
        </ProfileContent>
      )}
    </Wrapper>
  );
}

export default Landlord;
