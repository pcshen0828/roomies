import React from "react";
import styled from "styled-components";

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

  function checkIsNaN(e) {
    handleError("");
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
      handleError("只能輸入數字！");
    }
  }

  return (
    <>
      {otherInfo.map((info, index) => (
        <React.Fragment key={index}>
          <SmallLabel htmlFor={info.id}>
            {info.name}
            {(info.name === "所在樓層" || info.name === "房源特色") && (
              <Required>*</Required>
            )}
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
                <React.Fragment key={index}>
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
                </React.Fragment>
              ))}
            </CheckboxWrapper>
          ) : (
            <Input
              id={info.id}
              value={info.value}
              onKeyPress={(event) => {
                if (info.name === "所在樓層" || info.name === "坪數") {
                  checkIsNaN(event);
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
                if (info.name === "所在樓層" && !e.target.value.trim()) {
                  handleError("請輸入所在樓層");
                }
                if (info.name === "坪數" && !e.target.value.trim()) {
                  handleError("請輸入房源坪數");
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
        </React.Fragment>
      ))}
    </>
  );
}

export default CreatePropertyPage3;
