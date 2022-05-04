import React from "react";
import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
} from "../modals/ModalElements";
import api from "../../utils/api";
import { Firebase } from "../../utils/firebase";
import CreatePropertyPage1 from "./propertyCreateModal2.0/CreatePropertyPage1";
import CreatePropertyPage2 from "./propertyCreateModal2.0/CreatePropertyPage2";
import CreatePropertyPage3 from "./propertyCreateModal2.0/CreatePropertyPage3";
import CreatePropertyPage4 from "./propertyCreateModal2.0/CreatePropertyPage4";
import ConfirmBeforeQuitModal from "../modals/ConfirmBeforeQuit";
import { useAuth } from "../../context/AuthContext";
import { FlexWrapper } from "../common/Components";

const NewModal = styled(Modal)`
  width: 80%;
  max-width: 960px;
  height: 80%;
  max-height: 900px;
`;

const NewBody = styled(Body)`
  height: auto;
  height: 400px;
  padding: 10px 0 10px 60px;
  border: none;
  width: 80%;
  border: 1px solid #000;
  margin-top: 0;
`;

const BofyInnerWrapper = styled(FlexWrapper)`
  position: relative;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  border: 1px solid red;
`;

const StepsWrapper = styled(FlexWrapper)`
  flex-direction: column;
  width: 20%;
  border: 1px solid blue;
`;

function CreatePropertyModal({ toggle }) {
  const { currentUser } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [apartmentId, setApartmentId] = React.useState("");
  const [apartment, setApartment] = React.useState({});
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
          apartment={apartment}
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
          apartment={apartment}
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
          apartment={apartment}
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
          apartment={apartment}
        />
      ),
    },
  ];

  React.useEffect(() => {
    const newTeamRef = api.createNewDocRef("apartments");
    const time = Firebase.Timestamp.fromDate(new Date());
    api.setNewDoc(newTeamRef, {
      id: newTeamRef.id,
      createTime: time,
      updateTime: time,
      status: 0,
      owner: currentUser.uid,
    });
    setApartmentId(newTeamRef.id);
  }, []);

  React.useEffect(() => {
    const query = api.createQuery("apartments", "id", "==", apartmentId);
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      console.log(querySnapShot.docs.map((doc) => doc.data())[0]);
      setApartment(querySnapShot.docs.map((doc) => doc.data())[0]);
    });

    return unsubscribe;
  }, [apartmentId]);

  return (
    <>
      {openConfirm && (
        <ConfirmBeforeQuitModal toggle={toggle} apartmentId={apartmentId} />
      )}
      <Overlay out={false}>
        <NewModal>
          <Header>
            <Title>上架房源</Title>
            <CloseButton
              onClick={() => {
                setOpenConfirm(true);
              }}
            >
              ×
            </CloseButton>
          </Header>
          <BofyInnerWrapper>
            <StepsWrapper>
              <div>1</div>
              <div>2</div>
              <div>3</div>
            </StepsWrapper>
            <NewBody>
              {pages.map((page) => page.number === paging && page.component)}
            </NewBody>
          </BofyInnerWrapper>
        </NewModal>
      </Overlay>
    </>
  );
}

export default CreatePropertyModal;
