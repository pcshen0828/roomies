import styled from "styled-components";
import { subColor } from "../../styles/GlobalStyle";
import { FlexWrapper, StyledLink } from "../common/Components";
import github from "../../images/github.svg";
import linkedin from "../../images/linkedin.svg";

const Wrapper = styled.div`
  width: 100%;
  height: 120px;
  background: #f0f2f5;
  background-origin: border-box;
  padding: 20px 0 5px;
`;

const InnerWrapper = styled(FlexWrapper)`
  position: relative;
  width: calc(100% - 48px);
  padding: 0 24px;
  max-width: 1200px;
  height: calc(100% - 30px);
  margin: 20px auto;
  justify-content: space-between;
  align-items: flex-start;
  @media screen and (max-width: 767.98px) {
    flex-direction: column;
  }
`;

const NewLink = styled(StyledLink)`
  margin: 0 20px 0 0;
  font-size: 14px;
  transition: color 0.2s ease;
  &:hover {
    border-bottom: 1px solid transparent;
    color: ${subColor};
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const CopyrightWrapper = styled(FlexWrapper)`
  width: calc(100% - 10px);
  border-top: 1px solid #424b5a4d;
  padding: 15px 10px 0 0;
  font-size: 12px;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: 0;
`;

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <Wrapper>
      <InnerWrapper>
        <FlexWrapper>
          <NewLink to="/apartments">所有房源</NewLink>
          <NewLink to="/explore">探索</NewLink>
          <NewLink to="/">操作流程</NewLink>
        </FlexWrapper>
        <CopyrightWrapper>
          <a href="https://github.com/pcshen0828" target="_blank">
            <Icon src={github} />
          </a>
          <a
            href="http://www.linkedin.com/in/michelle-shen-65509b201"
            target="_blank"
          >
            <Icon src={linkedin} />
          </a>
          &copy; {year} 寓見 Roomies. All rights reserved.
        </CopyrightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
}
