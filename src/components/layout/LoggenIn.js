import React from "react";
import styled from "styled-components";
import member from "../../images/member.svg";
import notice from "../../images/notice.svg";
import message from "../../images/message.svg";
import { FlexWrapper } from "../common/Components";

const icons = [member, message, notice];

const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 20px;
  cursor: pointer;
`;

function LoggedIn() {
  return (
    <FlexWrapper>
      {icons.map((icon, index) => (
        <Icon src={icon} key={index} />
      ))}
    </FlexWrapper>
  );
}

export default LoggedIn;
