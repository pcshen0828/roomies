import React from "react";
import styled from "styled-components";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import CreatePropertyModal from "./CreateProperty2.0";
import { Firebase } from "../../utils/firebase";
import { CloseButton } from "../modals/ModalElements";
import SuccessfullySavedModal from "../modals/SuccessfullySaved";

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
  margin: 0 20px 20px 0;
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

function LandlordProperty() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [apartment, setApartment] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [tab, setTab] = React.useState("active");
  const navigate = useNavigate();
  const [paging, setPaging] = React.useState(1);
  const itemsPerPage = 6;

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

  function Render(status) {
    const data = properties.filter((property) => property.status === status);
    return (
      <>
        <NewFlexWrapper>
          {data.length ? (
            data
              .slice((paging - 1) * itemsPerPage, paging * itemsPerPage)
              .map((item, index) => (
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
                    <Button1
                      onClick={() => {
                        setOpenEdit(true);
                        setApartment(item);
                      }}
                    >
                      編輯
                    </Button1>
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
      {saved && <SuccessfullySavedModal toggle={setSaved} />}
      <NewWrapper>
        <NewButton onClick={() => setOpenCreate(true)}>新增房源</NewButton>
        <TabsWrapper>
          <Tab
            active={tab === "active"}
            onClick={() => {
              setTab("active");
              navigate("/profile/apartments?status=active");
            }}
          >
            已上架
          </Tab>
          <Tab
            active={tab === "inactive"}
            onClick={() => {
              setTab("inactive");
              navigate("/profile/apartments?status=inactive");
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
