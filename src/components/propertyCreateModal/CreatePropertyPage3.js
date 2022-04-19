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
import { Firebase } from "../../utils/firebase";

const CheckboxWrapper = styled(FlexWrapper)`
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled(SmallLabel)`
  margin: 3px 10px 5px 3px;
`;

function CreatePropertyPage3({ id, paging, setPaging, apartment }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [otherInfo, setOtherInfo] = React.useState([]);

  // 處理被轉成字串的 boolean value
  const stringToBoolean = (string) => (string === "false" ? false : !!string);
  const otherInfoList = [
    { en: "availableTime", zh: "可入住日期", value: "" },
    { en: "depositMonth", zh: "押金（月）", value: 0 },
    { en: "feature", zh: "房源特色", value: "" },
    { en: "floor", zh: "所在樓層", value: 1 },
    { en: "isRentIncludeUtilities", zh: "房租含水電雜費", value: false },
    { en: "managementFee", zh: "管理費", value: false },
    { en: "minLeaseTerm", zh: "最短租期", value: "半年" },
    { en: "squareFeet", zh: "坪數", value: 50 },
  ].map((item) => ({
    docName: item.en,
    content: { id: item.en, name: item.zh, value: item.value },
  }));

  React.useEffect(() => {
    otherInfoList.forEach((item) => {
      const newDocRef = Firebase.doc(
        Firebase.db,
        "apartments",
        id,
        "otherInfo",
        item.docName
      );
      api.setNewDoc(newDocRef, {
        ...item.content,
      });
    });
  }, []);

  React.useEffect(() => {
    api
      .getAllDocsFromCollection("apartments/" + id + "/otherInfo")
      .then((res) => {
        console.log(res);
        setOtherInfo(res);
      });
  }, [apartment]);

  function updateApartmentInfo() {
    setIsLoading(true);
    otherInfo.forEach((info) => {
      api.updateSubCollectionDocData("apartments", id, "otherInfo", info.id, {
        id: info.id,
        name: info.name,
        value: info.value,
      });
    });
    const time = Firebase.Timestamp.fromDate(new Date());
    api.updateDocData("apartments", id, {
      updateTime: time,
    });
    setIsLoading(false);
    setPaging((prev) => (prev < 4 ? prev + 1 : 4));
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
        {paging < 4 &&
          (isLoading ? (
            <LoadingButton>上傳中</LoadingButton>
          ) : (
            <button onClick={updateApartmentInfo}>儲存並繼續</button>
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

export default CreatePropertyPage3;
