import React from "react";
import styled from "styled-components";
import member from "../../images/member.svg";
import notice from "../../images/notice.svg";
import message from "../../images/message.svg";
import { FlexWrapper } from "../common/Components";
import { Link } from "react-router-dom";

const icons = [
  { src: member, link: "/profile" },
  { src: message, link: "" },
  { src: notice, link: "" },
];

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
        <Link to={icon.link} key={index}>
          <Icon src={icon.src} />
        </Link>
      ))}
    </FlexWrapper>
  );
}

export default LoggedIn;
