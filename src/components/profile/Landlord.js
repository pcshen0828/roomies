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

const Wrapper = styled(BodyWrapper)`
  margin-top: 0px;
`;

const profilelist = [
  { name: "會員基本資料", id: 1 },
  { name: "房源管理", id: 2 },
  { name: "行程管理", id: 3 },
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
          {listIndex === 2 && <LandlordProperty />}
          {listIndex === 3 && <LandlordSchedule />}
        </ProfileContent>
      )}
    </Wrapper>
  );
}

export default Landlord;
