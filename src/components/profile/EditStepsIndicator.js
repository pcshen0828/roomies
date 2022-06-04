import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexWrapper, SmallTitle } from "../common/Components";

const StepsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: calc(30% - 20px);
  height: 100%;
  align-items: flex-start;
  padding: 20px 0 0 20px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border-right: 1px solid #e8e8e8;
  @media screen and (max-width: 767.98px) {
    width: calc(100% - 20px);
    flex-direction: row;
    height: 50px;
    box-shadow: none;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
    align-items: center;
  }
`;

const StepIndicator = styled(FlexWrapper)`
  width: 50px;
  height: 50px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0px 2px 30px rgba(193, 177, 138, 0.1);
  background: ${(props) => (props.active ? "#424b5a" : "none")};
  color: ${(props) => (props.active ? "#fff" : "#424b5a")};
  cursor: pointer;

  @media screen and (max-width: 767.98px) {
    width: 25px;
    height: 25px;
    margin: 0 10px 0 0;
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    width: 30px;
    height: 30px;
  }
`;

const StepWrapper = styled(FlexWrapper)`
  justify-content: center;
  align-items: center;
  margin: 0 20px 20px 0;
  @media screen and (max-width: 767.98px) {
    margin: 0 20px 10px 0;
  }
  @media screen and (max-width: 600px) {
    margin-right: 10px;
  }
`;

const StepName = styled(SmallTitle)`
  margin: 0;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

export default function EditStepsIndicator({ pages, paging, setPaging }) {
  return (
    <StepsWrapper>
      {pages.map((page) => (
        <StepWrapper key={page.number}>
          <StepIndicator
            active={page.number === paging}
            onClick={() => {
              setPaging(page.number);
            }}
          >
            {page.number}
          </StepIndicator>
          <StepName>{page.name}</StepName>
        </StepWrapper>
      ))}
    </StepsWrapper>
  );
}

EditStepsIndicator.propTypes = {
  pages: PropTypes.array.isRequired,
  paging: PropTypes.number.isRequired,
  setPaging: PropTypes.func.isRequired,
};
