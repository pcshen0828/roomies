import React from "react";
import styled from "styled-components";
import { Wrapper, FlexWrapper, SmallTitle } from "../common/Components";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import EditPropertyModal from "../modals/EditProperty";

const NewWrapper = styled(Wrapper)`
  margin: 0;
  margin-top: 10px;
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

  &:hover {
    background: #dadada;
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
  const [apartment, setApartment] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    api
      .getDataWithSingleQuery("apartments", "owner", "==", currentUser.uid)
      .then((res) => {
        if (!mounted) return;
        console.log(res);
        setProperties(res);
      });
    return function cleanup() {
      mounted = false;
    };
  }, [currentUser]);

  return (
    <>
      {openEdit && (
        <EditPropertyModal toggle={setOpenEdit} apartment={apartment} />
      )}
      <NewWrapper>
        <NewButton>新增房源</NewButton>
        <NewFlexWrapper>
          {properties.map((item, index) => (
            <Card key={index}>
              <CardImage src={item.coverImage}></CardImage>
              <CardBody>
                <SmallTitle>{item.title}</SmallTitle>
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setApartment(item);
                  }}
                >
                  編輯
                </button>
              </CardBody>
            </Card>
          ))}
        </NewFlexWrapper>
      </NewWrapper>
    </>
  );
}

export default LandlordProperty;
