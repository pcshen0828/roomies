import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CreatePropertyModal from "./CreateProperty";
import { Firebase } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import scrollToTop from "../../utils/scroll";

import styled from "styled-components";
import {
  Wrapper,
  FlexWrapper,
  SmallTitle,
  Button1,
  Bold,
  PagingList,
  PagingItem,
  SmallText,
  FlexColumn,
} from "../common/Components";
import EditPropertyModal from "./EditProperty";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";
import Skeleton from "react-loading-skeleton";
import ConfirmChangeStatus from "../modals/ConfirmChangeStatus";

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

function LandlordProperty() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [apartment, setApartment] = useState("");
  const [statusItem, setStatusItem] = useState("");

  const [openModalType, setOpenModalType] = useState("");
  const [confirmType, setConfirmType] = useState("");
  const [saved, setSaved] = useState(false);

  const [paging, setPaging] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  function Render(status) {
    const data = properties.filter((property) => property.status === status);
    return (
      <>
        {confirmType !== "" && (
          <ConfirmChangeStatus
            currentStatus={confirmType === "becomeActive" ? 0 : 1}
            item={statusItem}
            successfullySaved={() => setSaved(true)}
            toggle={() => setConfirmType("")}
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
                  <TitleWrapper>
                    <StyledLink to={`/apartment/${item.id}`}>
                      <CardTitle title={item.title}>{item.title}</CardTitle>
                    </StyledLink>
                  </TitleWrapper>
                  <EditWrapper>
                    <EditButton
                      onClick={() => {
                        setOpenModalType("edit");
                        setApartment(item);
                      }}
                    >
                      編輯
                    </EditButton>
                    {status === 0 ? (
                      <StatusButton
                        onClick={() => {
                          setStatusItem(item);
                          setConfirmType("becomeActive");
                        }}
                      >
                        上架
                      </StatusButton>
                    ) : (
                      <StatusButton
                        onClick={() => {
                          setStatusItem(item);
                          setConfirmType("becomeInactive");
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
                      onClick={() => {
                        setPaging(number + 1);
                        scrollToTop();
                      }}
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
      {openModalType === "edit" && (
        <EditPropertyModal
          toggle={() => setOpenModalType("")}
          apartment={apartment}
          setSaved={setSaved}
          currentUser={currentUser}
        />
      )}
      {openModalType === "create" && (
        <CreatePropertyModal
          toggle={() => setOpenModalType("")}
          setSaved={setSaved}
          currentUser={currentUser}
        />
      )}
      {saved && (
        <SuccessfullySavedModal toggle={setSaved} message="儲存成功！" />
      )}
      <NewWrapper>
        <NewButton onClick={() => setOpenModalType("create")}>
          新增房源
        </NewButton>
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
