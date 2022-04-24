import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  Wrapper,
  FlexWrapper,
  SmallTitle,
  Button1,
} from "../common/Components";
import { useAuth } from "../../context/AuthContext";
import EditPropertyModal from "../modals/EditProperty";
import CreatePropertyModal from "../modals/CreateProperty";
import { Firebase } from "../../utils/firebase";

const NewWrapper = styled(Wrapper)`
  margin: 10px 0 20px;
`;

const NewFlexWrapper = styled(FlexWrapper)`
  flex-wrap: wrap;
  margin-top: 20px;
`;

const NewButton = styled.button`
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
  width: 250px;
  height: 280px;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
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

function LandlordProperty() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [apartment, setApartment] = React.useState("");

  React.useEffect(() => {
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "apartments"),
      Firebase.where("owner", "==", currentUser.uid),
      Firebase.orderBy("updateTime", "desc")
    );
    const unsubscribe = Firebase.onSnapshot(query, (querySnapShot) => {
      console.log(querySnapShot.docs.map((doc) => doc.data()));
      setProperties(querySnapShot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <>
      {openEdit && (
        <EditPropertyModal toggle={setOpenEdit} apartment={apartment} />
      )}
      {openCreate && (
        <CreatePropertyModal toggle={setOpenCreate} apartment={apartment} />
      )}
      <NewWrapper>
        <NewButton onClick={() => setOpenCreate(true)}>新增房源</NewButton>
        <SmallTitle>待上架</SmallTitle>
        <NewFlexWrapper>
          {properties
            .filter((property) => property.status === 0)
            .map((item, index) => (
              <Card key={index}>
                <CardImage src={item.coverImage}></CardImage>
                <CardBody>
                  <SmallTitle>{item.title}</SmallTitle>
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
            ))}
        </NewFlexWrapper>
        <SmallTitle>已上架</SmallTitle>
        <NewFlexWrapper>
          {properties
            .filter((property) => property.status === 1)
            .map((item, index) => (
              <Card key={index}>
                <CardImage src={item.coverImage}></CardImage>
                <CardBody>
                  <StyledLink to={`/apartment/${item.id}`}>
                    <SmallTitle>{item.title}</SmallTitle>
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
            ))}
        </NewFlexWrapper>
      </NewWrapper>
    </>
  );
}

export default LandlordProperty;
