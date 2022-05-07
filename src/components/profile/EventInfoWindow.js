import React from "react";
import styled from "styled-components";
import { NavModal, CloseButton } from "../modals/ModalElements";
import { FlexWrapper, Bold, SmallTitle } from "../common/Components";
import { Link } from "react-router-dom";

const EventInfoWindow = styled(NavModal)`
  border-radius: 10px;
  z-index: 10;
  width: auto;
  height: auto;
  max-width: 300px;
  @media screen and (max-width: 1279.98px) {
    max-width: 250px;
    left: 10px !important;
    top: 300px !important;
  }
`;

const Close = styled(CloseButton)`
  align-self: end;
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
`;

const MemberBar = styled(FlexWrapper)`
  margin-bottom: 20px;
  justify-content: space-between;
`;

export default function EventInfoWindowModal({
  coordinates,
  eventInfo,
  toggle,
}) {
  const host = eventInfo.extendedProps.members.find(
    (member) => member.uid === eventInfo.extendedProps.host
  );
  const others = eventInfo.extendedProps.members.filter(
    (member) => member !== host
  );

  return (
    <EventInfoWindow
      style={{
        top: `${coordinates.y}px`,
        left: `${coordinates.x - 280}px`,
      }}
    >
      <Close onClick={() => toggle(false)}>×</Close>
      <div>{eventInfo.title}</div>
      <SmallTitle>成員</SmallTitle>
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
      {others.map((member) => (
        <div key={member.uid}>
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
        </div>
      ))}
    </EventInfoWindow>
  );
}
