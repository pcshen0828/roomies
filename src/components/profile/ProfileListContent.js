import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

import styled from "styled-components";
import {
  BodyWrapper,
  ProfileList,
  ProfileItem,
  ProfileContent,
  Toggler,
  Toggle,
} from "../common/Components";

import TenantInfo from "./TenantInfo";
import GroupAndTeam from "./GroupAndTeam";
import TenantSchedule from "./TenantSchedule";

import LandlordInfo from "./LandlordInfo";
import LandlordProperty from "./LandlordProperty";
import LandlordSchedule from "./LandlordSchedule";

import more from "../../images/more.svg";
import less from "../../images/less.svg";
import { FooterHeight, HeaderHeight } from "../../styles/GlobalStyle";

const Wrapper = styled(BodyWrapper)`
  margin-top: 10px;
  min-height: calc(100vh - ${HeaderHeight + FooterHeight}px);
  width: 100%;
  @media screen and (max-width: 1279.98px) {
    flex-direction: cloumn;
    justify-content: flex-start;
  }
`;

const tenantProfilelist = [
  {
    name: "會員基本資料",
    id: 1,
    to: "/profile/info",
    defaultStatus: "edit",
    component: <TenantInfo key="1" />,
  },
  {
    name: "租屋活動管理",
    id: 2,
    to: "/profile/groupteam",
    defaultStatus: "groups",
    component: <GroupAndTeam key="3" />,
  },
  {
    name: "預約看房管理",
    id: 3,
    to: "/profile/schedule",
    defaultStatus: "pending",
    component: <TenantSchedule key="4" />,
  },
];

const landlordProfileList = [
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

export default function ProfileListContent({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  function getRenderContent() {
    if (role === "tenant") return tenantProfilelist;
    if (role === "landlord") return landlordProfileList;
  }

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
        {getRenderContent().map((item, index) => (
          <ProfileItem
            key={index}
            active={location.pathname.startsWith(item.to)}
            onClick={() => {
              setShow(false);
              navigate(`${item.to}/${item.defaultStatus}`);
            }}
          >
            {item.name}
          </ProfileItem>
        ))}
      </ProfileList>
      <ProfileContent>
        {getRenderContent().map(
          (item) => location.pathname.startsWith(item.to) && item.component
        )}
      </ProfileContent>
    </Wrapper>
  );
}

ProfileListContent.propTypes = {
  role: PropTypes.string.isRequired,
};
