import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
} from "./ModalElements";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import CreatePropertyPage1 from "../propertyCreateModal/CreatePropertyPage1";
import CreatePropertyPage2 from "../propertyCreateModal/CreatePropertyPage2";
import CreatePropertyPage3 from "../propertyCreateModal/CreatePropertyPage3";
import CreatePropertyPage4 from "../propertyCreateModal/CreatePropertyPage4";

const NewBody = styled(Body)`
  height: auto;
  max-height: 80%;
  padding: 10px 0 10px 10px;
`;

const NewModal = styled(Modal)`
  width: 80%;
  height: 70%;
`;

function CreatePropertyModal({ toggle }) {
  const [apartmentId, setApartmentId] = React.useState("");
  const [paging, setPaging] = React.useState(1);
  const pages = [
    {
      number: 1,
      component: (
        <CreatePropertyPage1
          key={1}
          paging={paging}
          setPaging={setPaging}
          id={apartmentId}
        />
      ),
    },
    {
      number: 2,
      component: (
        <CreatePropertyPage2
          key={2}
          paging={paging}
          setPaging={setPaging}
          id={apartmentId}
        />
      ),
    },
    {
      number: 3,
      component: (
        <CreatePropertyPage3
          key={3}
          paging={paging}
          setPaging={setPaging}
          id={apartmentId}
        />
      ),
    },
    {
      number: 4,
      component: (
        <CreatePropertyPage4
          key={4}
          paging={paging}
          setPaging={setPaging}
          toggle={toggle}
          id={apartmentId}
        />
      ),
    },
  ];

  React.useEffect(() => {
    // 一開始 mounted 的時候先建立一個 apartment document reference 並取得 id
    // 然後之後的 page 都更新到這一個 reference
    const newTeamRef = api.createNewDocRef("apartments");
    const time = Firebase.Timestamp.fromDate(new Date());
    api.setNewDoc(newTeamRef, {
      id: newTeamRef.id,
      createTime: time,
      updateTime: time,
    });
    setApartmentId(newTeamRef.id);
  }, []);

  async function CloseAndDeleteDoc() {
    // await Firebase.deleteDoc(
    //   Firebase.doc(Firebase.db, "apartments", apartmentId)
    // );
    toggle(false);
  }

  return (
    <Overlay>
      <NewModal>
        <Header>
          <Title>上架房源</Title>
          <CloseButton
            onClick={() => {
              toggle(false);
            }}
          >
            ×
          </CloseButton>
        </Header>
        <NewBody>
          {pages.map((page) => page.number === paging && page.component)}
        </NewBody>
      </NewModal>
    </Overlay>
  );
}

export default CreatePropertyModal;
