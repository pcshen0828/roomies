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
import EditPropertyPage1 from "../propertyEditModal/EditPropertyPage1";
import EditPropertyPage2 from "../propertyEditModal/EditPropertyPage2";
import EditPropertyPage3 from "../propertyEditModal/EditPropertyPage3";
import EditPropertyPage4 from "../propertyEditModal/EditPropertyPage4";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";

const NewBody = styled(Body)`
  height: auto;
  max-height: 80%;
  padding: 10px 0 10px 10px;
`;

const NewModal = styled(Modal)`
  width: 80%;
  height: 70%;
`;

function EditPropertyModal({ toggle, apartment }) {
  const [paging, setPaging] = React.useState(1);
  const [snapApartment, setSnapApartment] = React.useState(apartment);
  const pages = [
    {
      number: 1,
      component: (
        <EditPropertyPage1
          key={1}
          apartment={snapApartment}
          paging={paging}
          setPaging={setPaging}
        />
      ),
    },
    {
      number: 2,
      component: (
        <EditPropertyPage2
          key={2}
          apartment={snapApartment}
          paging={paging}
          setPaging={setPaging}
        />
      ),
    },
    {
      number: 3,
      component: (
        <EditPropertyPage3
          key={3}
          apartment={snapApartment}
          paging={paging}
          setPaging={setPaging}
        />
      ),
    },
    {
      number: 4,
      component: (
        <EditPropertyPage4
          key={4}
          apartment={snapApartment}
          paging={paging}
          setPaging={setPaging}
          toggle={toggle}
        />
      ),
    },
  ];
  React.useEffect(() => {
    const query = api.createQuery("apartments", "id", "==", apartment.id);
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      console.log(querySnapShot.docs.map((doc) => doc.data())[0]);
      setSnapApartment(querySnapShot.docs.map((doc) => doc.data())[0]);
    });

    return unsubscribe;
  }, []);

  return (
    <Overlay out={false}>
      <NewModal>
        <Header>
          <Title>編輯房源資訊</Title>
          <CloseButton onClick={() => toggle(false)}>×</CloseButton>
        </Header>
        <NewBody>
          {pages.map((page) => page.number === paging && page.component)}
        </NewBody>
      </NewModal>
    </Overlay>
  );
}

export default EditPropertyModal;
