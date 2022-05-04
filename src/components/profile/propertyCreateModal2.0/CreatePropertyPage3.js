import React from "react";
import styled from "styled-components";

import {
  SmallLabel,
  Input,
  FlexWrapper,
  Textarea,
} from "../../common/Components";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function CreatePropertyPage3({ otherInfo, setOtherInfo }) {
  const stringToBoolean = (string) => (string === "false" ? false : !!string);

  return (
    <>
      {otherInfo.map((info, index) => (
        <React.Fragment key={index}>
          <SmallLabel htmlFor={info.id}>{info.name}</SmallLabel>
          {info.id === "feature" ? (
            <Textarea
              id={info.id}
              value={info.value}
              onChange={(e) => {
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
              onChange={(e) => {
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
