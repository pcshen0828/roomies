import React from "react";
import styled from "styled-components";
import {
  BodyWrapper,
  ProfileList,
  ProfileItem,
  ProfileContent,
} from "../common/Components";
import LandlordInfo from "./LandlordInfo";

const Wrapper = styled(BodyWrapper)`
  margin-top: 0px;
`;

const profilelist = [
  { name: "會員基本資料", id: 1 },
  { name: "房源管理", id: 2 },
  { name: "預約看房管理", id: 3 },
];

function Landlord() {
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
          {listIndex === 1 && <LandlordInfo />}
          {listIndex === 2 && <>房源管理</>}
          {listIndex === 3 && <>預約看房管理</>}
        </ProfileContent>
      )}
    </Wrapper>
  );
}

export default Landlord;
