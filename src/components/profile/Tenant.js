import React from "react";
import styled from "styled-components";
import {
  BodyWrapper,
  ProfileList,
  ProfileItem,
  ProfileContent,
} from "../common/Components";
import TenantInfo from "./TenantInfo";

const Wrapper = styled(BodyWrapper)`
  margin-top: 0px;
`;

const profilelist = [
  { name: "會員基本資料", id: 1 },
  { name: "我的收藏", id: 2 },
  { name: "房源管理", id: 3 },
];

function Tenant() {
  const [listIndex, setListIndex] = React.useState(1);
  return (
    <Wrapper>
      <ProfileList>
        {profilelist.map((item, index) => (
          <ProfileItem
            key={index}
            active={listIndex === item.id}
            onClick={() => setListIndex(item.id)}
          >
            {item.name}
          </ProfileItem>
        ))}
      </ProfileList>
      {listIndex && (
        <ProfileContent>
          {listIndex === 1 && <TenantInfo />}
          {listIndex === 2 && <>我的收藏</>}
          {listIndex === 3 && <>房源管理</>}
        </ProfileContent>
      )}
    </Wrapper>
  );
}

export default Tenant;
