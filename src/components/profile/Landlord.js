import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import styled from "styled-components";
import {
  BodyWrapper,
  ProfileList,
  ProfileItem,
  ProfileContent,
  Toggler,
  Toggle,
} from "../common/Components";
import LandlordInfo from "./LandlordInfo";
import LandlordProperty from "./LandlordProperty";
import LandlordSchedule from "./LandlordSchedule";
import more from "../../images/more.svg";
import less from "../../images/less.svg";

const Wrapper = styled(BodyWrapper)`
  margin-top: 10px;
  min-height: calc(100vh - 80px - 271px);
  width: 100%;
  @media screen and (max-width: 1279.98px) {
    flex-direction: cloumn;
    justify-content: flex-start;
  }
`;

const profilelist = [
  {
    name: "會員基本資料",
    id: 1,
    to: "/profile/info",
    defaultStatus: "edit",
    component: <LandlordInfo key="1" />,
  },
  {
    name: "房源管理",
    id: 2,
    to: "/profile/apartments",
    defaultStatus: "active",
    component: <LandlordProperty key="2" />,
  },
  {
    name: "行程管理",
    id: 3,
    to: "/profile/schedule",
    defaultStatus: "pending",
    component: <LandlordSchedule key="3" />,
  },
];

function Landlord() {
  const [listIndex, setListIndex] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { id, status } = useParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const current = profilelist.find(
      (item) => item.to === `/profile/${id}/${status}`
    );
    setListIndex(current && current.id);
  }, []);

  return (
    <Wrapper>
      <Toggler
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        {show ? "收合選單" : "展開選單"}
        {show ? <Toggle src={less} /> : <Toggle src={more} />}
      </Toggler>
      <ProfileList show={show}>
        {profilelist.map((item, index) => (
          <ProfileItem
            key={index}
            active={location.pathname.startsWith(item.to)}
            onClick={() => {
              setShow(false);
              setListIndex(item.id);
              navigate(`${item.to}/${item.defaultStatus}`);
            }}
          >
            {item.name}
          </ProfileItem>
        ))}
      </ProfileList>
      <ProfileContent>
        {profilelist.map(
          (item) => location.pathname.startsWith(item.to) && item.component
        )}
      </ProfileContent>
    </Wrapper>
  );
}

export default Landlord;
