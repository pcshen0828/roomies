import React from "react";
import styled from "styled-components";

import {
  SmallLabel,
  Input,
  FlexWrapper,
  Textarea,
  LoadingButton,
  PagingList,
} from "../common/Components";
import api from "../../utils/api";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function EditPropertyPage3({ apartment, paging, setPaging }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [otherInfo, setOtherInfo] = React.useState([]);

  // 處理被轉成字串的 boolean value
  const stringToBoolean = (string) => (string === "false" ? false : !!string);

  React.useEffect(() => {
    console.log(apartment);
    api
      .getAllDocsFromCollection("apartments/" + apartment.id + "/otherInfo")
      .then((res) => {
        console.log(res);
        setOtherInfo(res);
      });
  }, [apartment]);

  function updateApartmentInfo() {
    otherInfo.forEach((info) => {
      api.updateSubCollectionDocData(
        "apartments",
        apartment.id,
        "otherInfo",
        info.id,
        {
          id: info.id,
          name: info.name,
          value: info.value,
        }
      );
    });
  }

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
      <PagingList>
        {paging > 1 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button
              onClick={() => setPaging((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              上一頁
            </button>
          ))}
        {paging < 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button
              onClick={() => setPaging((prev) => (prev < 4 ? prev + 1 : 4))}
            >
              儲存並繼續
            </button>
          ))}
        {paging === 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button>儲存並完成</button>
          ))}
      </PagingList>
    </>
  );
}

export default EditPropertyPage3;
