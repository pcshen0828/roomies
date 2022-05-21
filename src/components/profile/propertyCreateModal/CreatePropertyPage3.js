import React, { Fragment } from "react";
import styled from "styled-components";
import { checkEventKeyIsNaN } from "../../../utils/calculate";

import {
  SmallLabel,
  Input,
  FlexWrapper,
  Textarea,
  Required,
} from "../../common/Components";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function CreatePropertyPage3({ otherInfo, setOtherInfo, handleError }) {
  const stringToBoolean = (string) => (string === "false" ? false : !!string);

  return (
    <>
      {otherInfo.map((info, index) => (
        <Fragment key={index}>
          <SmallLabel htmlFor={info.id}>
            {info.name}
            <Required>*</Required>
          </SmallLabel>
          {info.id === "feature" ? (
            <Textarea
              id={info.id}
              value={info.value}
              onFocus={() => {
                handleError("");
              }}
              onChange={(e) => {
                if (!e.target.value.trim()) {
                  handleError("請輸入房源特色");
                }
                setOtherInfo((prev) =>
                  prev.map((item) =>
                    item.id === info.id
                      ? { ...item, value: e.target.value }
                      : item
                  )
                );
              }}
            />
          ) : info.name === "房租含水電雜費" || info.name === "管理費" ? (
            <CheckboxWrapper>
              {[
                { name: "是", value: true },
                { name: "否", value: false },
              ].map((choice, index) => (
                <Fragment key={index}>
                  <input
                    id={`${info.id}${index}`}
                    name={info.id}
                    checked={info.value === choice.value}
                    type="radio"
                    value={choice.value}
                    onFocus={() => {
                      handleError("");
                    }}
                    onChange={(e) => {
                      setOtherInfo((prev) =>
                        prev.map((item) =>
                          item.id === info.id
                            ? {
                                ...item,
                                value: stringToBoolean(e.target.value),
                              }
                            : item
                        )
                      );
                    }}
                  />
                  <CheckboxLabel htmlFor={`${info.id}${index}`}>
                    {choice.name}
                  </CheckboxLabel>
                </Fragment>
              ))}
            </CheckboxWrapper>
          ) : (
            <Input
              id={info.id}
              value={info.value}
              onKeyPress={(event) => {
                if (info.name === "所在樓層" || info.name === "坪數") {
                  const bool = checkEventKeyIsNaN(event);
                  if (bool) event.preventDefault();
                  handleError(bool ? "只能輸入數字！" : "");
                }
              }}
              onFocus={() => {
                handleError("");
              }}
              onChange={(e) => {
                if (
                  (info.name === "所在樓層" || info.name === "坪數") &&
                  parseInt(e.target.value) < 1
                ) {
                  handleError("請輸入有效數值");
                  e.target.value = "";
                }
                if (
                  (info.id === "availableTime" ||
                    info.id === "depositMonth" ||
                    info.id === "floor" ||
                    info.id === "minLeaseTerm" ||
                    info.id === "squareFeet") &&
                  !e.target.value.trim()
                ) {
                  handleError("請完整填寫其他資訊");
                }
                setOtherInfo((prev) =>
                  prev.map((item) =>
                    item.id === info.id
                      ? { ...item, value: e.target.value }
                      : item
                  )
                );
              }}
            />
          )}
        </Fragment>
      ))}
    </>
  );
}

export default CreatePropertyPage3;
