import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrapper,
  FlexWrapper,
  SmallTitle,
  Button1,
  Bold,
  PagingList,
  PagingItem,
  SmallText,
} from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import EditPropertyModal from "../modals/EditProperty";
import CreatePropertyModal from "./CreateProperty";
import { Firebase } from "../../utils/firebase";
import {
  Overlay,
  Modal,
  Header,
  Title,
  Button,
  CloseButton,
} from "../modals/ModalElements";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import api from "../../utils/api";
import edit from "../../images/edit.svg";

const NewWrapper = styled(Wrapper)`
  margin: 10px 0 20px;
`;

const NewFlexWrapper = styled(FlexWrapper)`
  flex-wrap: wrap;
  margin-top: 20px;
  min-height: 610px;
  align-items: flex-start;
`;

const NewButton = styled(Button1)`
  width: 100px;
  height: 40px;
  border: 1px solid #dadada;
  border-radius: 5px;
  background: none;
  color: #424b5a;
  margin-bottom: 30px;

  &:hover {
    background: #dadada;
  }
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: block;
  margin: 5px 0 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const Card = styled.div`
  margin: 0 15px 20px 0;
  width: 240px;
  height: 280px;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

const CardImage = styled.div`
  height: 60%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CardBody = styled.div`
  height: 40%;
  padding: 20px;
`;

const CardTitle = styled(Bold)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TabsWrapper = styled(FlexWrapper)`
  border-bottom: 1px solid #dadada;
`;

const Tab = styled(SmallTitle)`
  cursor: pointer;
  margin: 0 10px 0 0;
  padding: 0 10px 10px 10px;
  border-bottom: ${(props) =>
    props.active ? "2px solid #424b5a" : "2px solid transparent"};
`;

const StatusButton = styled(Button1)`
  width: 60px;
  height: 36px;
  background: none;
  border: 1px solid #dadada;
  color: #424b5a;
  &:hover {
    background: #dadada;
  }
`;

const EditButton = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 15px;
  cursor: pointer;
`;

const EditWrapper = styled(FlexWrapper)`
  justify-content: flex-end;
`;

const NewModal = styled(Modal)`
  max-width: 600px;
`;

function ConfirmChangeStatus({ currentStatus, item, setSaved, toggle }) {
  function updateStatus() {
    const time = Firebase.Timestamp.fromDate(new Date());
    if (currentStatus === 0) {
      api
        .updateDocData("apartments", item.id, {
          updateTime: time,
          status: 1,
        })
        .then(() => {
          toggle(false);
          setSaved(true);
        });
    } else {
      api
        .updateDocData("apartments", item.id, {
          updateTime: time,
          status: 0,
        })
        .then(() => {
          toggle(false);
          setSaved(true);
        });
    }
  }
  return (
    <Overlay>
      <NewModal>
        <Header>
          <Title>確認更新？</Title>
          <CloseButton
            onClick={() => {
              toggle(false);
            }}
          >
            ×
          </CloseButton>
        </Header>
        <Button onClick={updateStatus}>確認</Button>
      </NewModal>
    </Overlay>
  );
}

function LandlordProperty() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [apartment, setApartment] = React.useState("");
  const [statusItem, setStatusItem] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [confirmActive, setConfirmActive] = React.useState(false);
  const [confirmInactive, setConfirmInactive] = React.useState(false);
  const [tab, setTab] = React.useState("active");
  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "apartments"),
      Firebase.where("owner", "==", currentUser.uid),
      Firebase.orderBy("updateTime", "desc")
    );
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      setProperties(querySnapShot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }, [currentUser]);

  function createPaging(num) {
    return Array.from(Array(num).keys());
  }

  function handleActiveStatus(status) {
    if (status === 0) {
      setConfirmActive(true);
    } else {
      setConfirmInactive(true);
    }
  }

  function Render(status) {
    const data = properties.filter((property) => property.status === status);
    return (
      <>
        {confirmActive && (
          <ConfirmChangeStatus
            currentStatus={0}
            item={statusItem}
            setSaved={setSaved}
            toggle={setConfirmActive}
          />
        )}
        {confirmInactive && (
          <ConfirmChangeStatus
            currentStatus={1}
            item={statusItem}
            setSaved={setSaved}
            toggle={setConfirmInactive}
          />
        )}
        <NewFlexWrapper>
          {data.length ? (
            data
              .slice((paging - 1) * itemsPerPage, paging * itemsPerPage)
              .map((item) => (
                <Card key={item.id}>
                  {status === 0 && (
                    <CloseButton
                      onClick={() => {
                        Firebase.deleteDoc(
                          Firebase.doc(Firebase.db, "apartments", item.id)
                        );
                      }}
                    >
                      ×
                    </CloseButton>
                  )}
                  <CardImage src={item.coverImage}></CardImage>
                  <CardBody>
                    <StyledLink to={`/apartment/${item.id}`}>
                      <CardTitle title={item.title}>{item.title}</CardTitle>
                    </StyledLink>
                    <EditWrapper>
                      {status === 0 ? (
                        <StatusButton
                          onClick={() => {
                            setStatusItem(item);
                            handleActiveStatus(status);
                          }}
                        >
                          上架
                        </StatusButton>
                      ) : (
                        <StatusButton
                          onClick={() => {
                            setStatusItem(item);
                            handleActiveStatus(status);
                          }}
                        >
                          下架
                        </StatusButton>
                      )}
                      <EditButton
                        src={edit}
                        onClick={() => {
                          setOpenEdit(true);
                          setApartment(item);
                        }}
                      />
                    </EditWrapper>
                  </CardBody>
                </Card>
              ))
          ) : (
            <SmallText>尚無資料</SmallText>
          )}
        </NewFlexWrapper>
        <PagingList>
          {data.length
            ? createPaging(Math.ceil(data.length / itemsPerPage)).map(
                (number, index) => (
                  <PagingItem
                    key={index}
                    onClick={() => setPaging(number + 1)}
                    active={paging === number + 1}
                  >
                    {number + 1}
                  </PagingItem>
                )
              )
            : ""}
        </PagingList>
      </>
    );
  }

  return (
    <>
      {openEdit && (
        <EditPropertyModal
          toggle={setOpenEdit}
          apartment={apartment}
          setSaved={setSaved}
        />
      )}
      {openCreate && (
        <CreatePropertyModal
          toggle={setOpenCreate}
          apartment={apartment}
          setSaved={setSaved}
        />
      )}
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="儲存成功！" />
      )}
      <NewWrapper>
        <NewButton onClick={() => setOpenCreate(true)}>新增房源</NewButton>
        <TabsWrapper>
          <Tab
            active={tab === "active"}
            onClick={() => {
              setTab("active");
              navigate("/profile/apartments/active");
            }}
          >
            已上架
          </Tab>
          <Tab
            active={tab === "inactive"}
            onClick={() => {
              setTab("inactive");
              navigate("/profile/apartments/inactive");
            }}
          >
            待上架
          </Tab>
        </TabsWrapper>
        {tab === "active" ? Render(1) : Render(0)}
      </NewWrapper>
    </>
  );
}

export default LandlordProperty;
