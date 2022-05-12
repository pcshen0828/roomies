import React from "react";
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
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
    component: <TenantInfo key="1" />,
  },
  {
    name: "社團 / 群組管理",
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

function Tenant() {
  const [listIndex, setListIndex] = React.useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { id, status } = useParams();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
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

export default Tenant;
