import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Button,
} from "./ModalElements";
import { Bold, FlexWrapper, SmallTitle } from "../common/Components";
import { Link } from "react-router-dom";

const NewBody = styled(Body)`
  height: 300px;
  padding: 10px;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  @media screen and (max-width: 767.98px) {
    width: 50px;
    height: 50px;
  }
`;

const MemberBar = styled(FlexWrapper)`
  margin-bottom: 20px;
  justify-content: space-between;
`;

export default function RequestDetailModal({ members, hostId, toggle }) {
  const host = members.find((member) => member.uid === hostId);
  const others = members.filter((member) => member !== host);

  return (
    <Overlay out={false}>
      <Modal>
        <Header>
          <Title>群組資訊</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <SmallTitle>團主</SmallTitle>
          <MemberBar key={host.uid}>
            <FlexWrapper>
              <Link to={`/users/${host.uid}`}>
                <ProfileImage src={host.profileImage} />
              </Link>
              <FlexWrapper>
                <Bold>{host.alias}</Bold>
              </FlexWrapper>
            </FlexWrapper>
          </MemberBar>
          <SmallTitle>成員</SmallTitle>
          {others.map((member) => (
            <MemberBar key={member.uid}>
              <FlexWrapper>
                <Link to={`/users/${member.uid}`}>
                  <ProfileImage src={member.profileImage} />
                </Link>
                <FlexWrapper>
                  <Bold>{member.alias}</Bold>
                </FlexWrapper>
              </FlexWrapper>
            </MemberBar>
          ))}
        </NewBody>
        <Button onClick={() => toggle(false)}>關閉</Button>
      </Modal>
    </Overlay>
  );
}
