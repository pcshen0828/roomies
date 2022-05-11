import React from "react";
import styled from "styled-components";
import {
  BodyWrapper,
  ProfileList,
  ProfileItem,
  ProfileContent,
} from "../common/Components";
import TenantInfo from "./TenantInfo";
import CollectionList from "./CollectionList";
import GroupAndTeam from "./GroupAndTeam";
import TenantSchedule from "./TenantSchedule";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Wrapper = styled(BodyWrapper)`
  margin-top: 10px;
  min-height: calc(100vh - 471px);
  width: 100%;
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
    defaultStatus: "edit",
    component: <TenantInfo key="1" />,
  },
  {
    name: "我的收藏",
    id: 2,
    to: "/profile/collection",
    defaultStatus: "all",
    component: <CollectionList key="2" />,
  },
  {
    name: "社團 / 群組管理",
    id: 3,
    to: "/profile/groupteam",
    defaultStatus: "groups",
    component: <GroupAndTeam key="3" />,
  },
  {
    name: "預約看房管理",
    id: 4,
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

  React.useEffect(() => {
    const current = profilelist.find(
      (item) => item.to === `/profile/${id}/${status}`
    );
    setListIndex(current && current.id);
  }, []);

  return (
    <Wrapper>
      <ProfileList>
        {profilelist.map((item, index) => (
          <ProfileItem
            key={index}
            active={location.pathname.startsWith(item.to)}
            onClick={() => {
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
