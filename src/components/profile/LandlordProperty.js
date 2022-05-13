import React from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Wrapper,
  FlexWrapper,
  SmallTitle,
  Button1,
  Bold,
  PagingList,
  PagingItem,
  SmallText,
  RejectButton,
  FlexColumn,
} from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import EditPropertyModal from "./EditProperty";
import CreatePropertyModal from "./CreateProperty";
import { Firebase } from "../../utils/firebase";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
} from "../modals/ModalElements";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import api from "../../utils/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NewWrapper = styled(Wrapper)`
  margin: 10px 0 20px;
  width: 100%;
`;

const NewFlexWrapper = styled(FlexColumn)`
  margin-top: 20px;
  min-height: 610px;
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

const Card = styled(FlexWrapper)`
  margin-bottom: 10px;
  width: calc(100% - 40px);
  padding: 0 20px;
  height: 90px;
  border: 1px solid #e8e8e8;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  justify-content: space-between;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
`;

const TitleWrapper = styled.div`
  max-width: 80%;
  flex-grow: 1;
  max-width: 60%;
  @media screen and (max-width: 575.98px) {
    flex-grow: 0;
    max-width: 50%;
  }
  @media screen and (max-width: 413.98px) {
    max-width: 100px;
  }
`;

const StyledLink = styled(Link)`
  color: #424b5a;
  display: flex;
  &:hover {
    text-decoration: underline;
  }
`;

const CardTitle = styled(Bold)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  max-width: 100%;
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
  @media screen and (max-width: 575.98px) {
    width: 50px;
    font-size: 14px;
  }
`;

const EditButton = styled(Button1)`
  width: 80px;
  height: 36px;
  margin-right: 15px;
  @media screen and (max-width: 575.98px) {
    width: 60px;
    font-size: 14px;
    margin-right: 10px;
  }
`;

const EditWrapper = styled(FlexWrapper)`
  justify-content: flex-start;
`;

const NewModal = styled(Modal)`
  max-width: 600px;
`;

const Buttons = styled(FlexWrapper)`
  align-self: end;
  margin-right: 20px;
  height: 90px;
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
        <Buttons>
          <Button1 onClick={updateStatus}>確認</Button1>
          <RejectButton
            onClick={() => {
              toggle(false);
            }}
          >
            取消
          </RejectButton>
        </Buttons>
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
  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "apartments"),
      Firebase.where("owner", "==", currentUser.uid),
      Firebase.orderBy("updateTime", "desc")
    );
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      setProperties(querySnapShot.docs.map((doc) => doc.data()));
      setLoading(false);
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
          {loading ? (
            <div style={{ width: "100%" }}>
              <Skeleton
                width="100%"
                height={90}
                count={3}
                borderRadius={20}
                style={{ margin: "0 15px 20px 0" }}
              />
            </div>
          ) : data.length ? (
            data
              .slice((paging - 1) * itemsPerPage, paging * itemsPerPage)
              .map((item) => (
                <Card key={item.id}>
                  {/* {status === 0 && (
                    <CloseButton
                      onClick={() => {
                        Firebase.deleteDoc(
                          Firebase.doc(Firebase.db, "apartments", item.id)
                        );
                      }}
                    >
                      ×
                    </CloseButton>
                  )} */}
                  <TitleWrapper>
                    <StyledLink to={`/apartment/${item.id}`}>
                      <CardTitle title={item.title}>{item.title}</CardTitle>
                    </StyledLink>
                  </TitleWrapper>
                  <EditWrapper>
                    <EditButton
                      onClick={() => {
                        setOpenEdit(true);
                        setApartment(item);
                      }}
                    >
                      編輯
                    </EditButton>
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
                  </EditWrapper>
                </Card>
              ))
          ) : (
            <SmallText>尚無資料</SmallText>
          )}
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
        </NewFlexWrapper>
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
          currentUser={currentUser}
        />
      )}
      {openCreate && (
        <CreatePropertyModal
          toggle={setOpenCreate}
          setSaved={setSaved}
          currentUser={currentUser}
        />
      )}
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="儲存成功！" />
      )}
      <NewWrapper>
        <NewButton onClick={() => setOpenCreate(true)}>新增房源</NewButton>
        <TabsWrapper>
          <Tab
            active={location.pathname === "/profile/apartments/active"}
            onClick={() => {
              navigate("/profile/apartments/active");
            }}
          >
            已上架
          </Tab>
          <Tab
            active={location.pathname === "/profile/apartments/inactive"}
            onClick={() => {
              navigate("/profile/apartments/inactive");
            }}
          >
            待上架
          </Tab>
        </TabsWrapper>
        {location.pathname === "/profile/apartments/active"
          ? Render(1)
          : Render(0)}
      </NewWrapper>
    </>
  );
}

export default LandlordProperty;
