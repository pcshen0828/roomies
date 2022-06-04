import PropTypes from "prop-types";
import styled from "styled-components";
import { mainColor } from "../../styles/GlobalStyle";
import {
  Button1,
  ExitButton,
  FlexWrapper,
  RejectButton,
  Title,
} from "../common/Components";
import { Modal } from "../modals/ModalElements";

import member from "../../images/members.svg";
import room from "../../images/room.svg";
import check from "../../images/check.svg";
import exit from "../../images/exit.svg";
import { Link } from "react-router-dom";

const HeaderWrapper = styled.div`
  width: 100%;
`;

const Wrapper = styled(FlexWrapper)`
  width: calc(100% - 48px);
  max-width: 1200px;
  justify-content: space-between;
  margin: 0 auto;
  padding: 15px 24px;

  @media screen and (max-width: 995.98px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ApartmentLink = styled(Link)`
  color: #424b5a;
  display: block;
  margin-right: 10px;
  &:hover {
    color: #c1b18a;
  }
`;

const NewTitle = styled(Title)`
  font-size: ${(props) => (props.sticky ? "16px" : "20px")};
  margin-bottom: ${(props) => (props.sticky ? "0" : "10px")};
  @media screen and (max-width: 1279.98px) {
    font-size: ${(props) => (props.sticky ? "16px" : "18px")};
  }
`;

const MainSubTitles = styled(FlexWrapper)`
  align-items: center;
  @media screen and (max-width: 995.98px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const SubTitles = styled(FlexWrapper)`
  align-items: center;
`;

const SubTitle = styled.div`
  color: ${mainColor};
  margin-right: 30px;
  @media screen and (max-width: 1279.98px) {
    font-size: 14px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const Buttons = styled(FlexWrapper)`
  @media screen and (max-width: 995.98px) {
    margin-top: 10px;
  }
`;

const InviteButton = styled(Button1)`
  width: 90px;
  @media screen and (max-width: 575.98px) {
    width: 90px;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const HasJoined = styled(FlexWrapper)`
  width: 128px;
  height: 42px;
  background: #fff;
  border: 1px solid #dadada;
  border-radius: 5px;
  color: ${mainColor};
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
`;

const Dropdown = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 3px;
  font-size: 20px;
  padding-bottom: 3px;
`;

const DropdownMenu = styled(Modal)`
  width: 200px;
  border-radius: 5px;
  position: absolute;
  z-index: 10;
  top: 50px;
  left: 0;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  align-items: flex-start;
  padding: 10px;
`;

export default function GroupHeader({
  currentUser,
  apartmentData,
  members,
  invitation,
  dropdown,
  toggle,
  setOpenModalType,
}) {
  return (
    <HeaderWrapper>
      <Wrapper>
        <MainSubTitles>
          <ApartmentLink to={`/apartment/${apartmentData.id}`}>
            <NewTitle>{apartmentData.title}</NewTitle>
          </ApartmentLink>
          <SubTitles>
            <Icon src={room} alt="" />
            <SubTitle>{`可住人數：${
              apartmentData.roomiesCount ? apartmentData.roomiesCount : ""
            }人 / 間`}</SubTitle>
          </SubTitles>
          <SubTitles>
            <Icon src={member} alt="" />
            <SubTitle>
              {members.length ? `${members.length}位成員已加入` : "尚無成員"}
            </SubTitle>
          </SubTitles>
        </MainSubTitles>
        {invitation &&
        !members.find((member) => member.uid === currentUser.uid) ? (
          <Buttons>
            <Button1
              onClick={() => {
                setOpenModalType("confirmJoin");
              }}
            >
              確認加入
            </Button1>
            <RejectButton
              onClick={() => {
                setOpenModalType("reject");
              }}
            >
              拒絕
            </RejectButton>
          </Buttons>
        ) : (
          ""
        )}
        {members.find((member) => member.uid === currentUser.uid) ? (
          <Buttons>
            <DropdownWrapper onClick={(e) => e.stopPropagation()}>
              <HasJoined
                onClick={() => {
                  toggle();
                }}
              >
                <Icon src={check} alt="" />
                已加入
                <Dropdown>▾</Dropdown>
              </HasJoined>
              {dropdown && (
                <DropdownMenu>
                  <ExitButton
                    onClick={() => {
                      setOpenModalType("quit");
                    }}
                  >
                    <Icon src={exit} alt="" />
                    退出
                  </ExitButton>
                </DropdownMenu>
              )}
            </DropdownWrapper>
            <InviteButton
              onClick={() => {
                setOpenModalType("invite");
              }}
            >
              邀請
            </InviteButton>
          </Buttons>
        ) : (
          ""
        )}
      </Wrapper>
    </HeaderWrapper>
  );
}

GroupHeader.propTypes = {
  currentUser: PropTypes.object,
  apartmentData: PropTypes.object,
  members: PropTypes.array,
  invitation: PropTypes.array,
  dropdown: PropTypes.bool,
  toggle: PropTypes.func,
  setOpenModalType: PropTypes.func,
};
