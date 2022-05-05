import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
  Button,
} from "./ModalElements";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const NewModal = styled(Modal)`
  max-width: 870px;
`;

const NewBody = styled(Body)`
  padding: 10px;
`;

const ContentList = styled.ol`
  line-height: 150%;
  margin-top: 10px;
`;

const ConfirmBlock = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-left: 20px;
`;

function JoinConfirmModal({ setIsActive, apartmentId, groupId }) {
  const { currentUser } = useAuth();
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const navigate = useNavigate();

  async function joinGroup() {
    if (!isConfirmed) return;
    api
      .getDataWithSingleQuery("groups", "apartmentId", "==", apartmentId)
      .then((res) => {
        console.log(res);
        if (res.length) {
          api.updateDocData("groups", res[0].id, {
            members: [...res[0].members, currentUser.uid],
          });
          navigate(`/groups/${groupId}`);
        } else {
          //建立 group 資料
          const newGroupRef = api.createNewDocRef("groups");
          api.setNewDoc(newGroupRef, {
            id: newGroupRef.id,
            apartmentId,
            members: [currentUser.uid],
          });
          navigate(`/groups/${newGroupRef.id}`);
        }
      });
  }

  return (
    <Overlay out={false}>
      <NewModal>
        <Header>
          <Title>租屋說明</Title>
          <CloseButton onClick={() => setIsActive(false)}>×</CloseButton>
        </Header>
        <NewBody>
          <Title>租屋流程</Title>
          <ContentList>
            <li>加入房源社團，尋找合租的室友</li>
            <li>人數到齊後，與屋主預約看房</li>
            <li>確認租屋設備、租金、押金等一切細節</li>
            <li>與屋主簽訂租屋契約</li>
          </ContentList>
          <Title>租屋須知</Title>
          <ContentList>
            <li>在社團中與他人互動，請保持禮貌，互相尊重</li>
            <li>與屋主預約看房請遵守約定，切勿無故未到</li>
            <li>
              若同時加入多筆房源社團，確認選定一處租屋後，請確實告知其他房源的合租夥伴，讓大家都能順利找到租屋
            </li>
          </ContentList>
        </NewBody>
        <ConfirmBlock>
          <Checkbox
            id="confirm"
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <label htmlFor="confirm">我已詳閱並同意以上租屋流程及須知</label>
        </ConfirmBlock>
        <Button onClick={joinGroup}>加入</Button>
      </NewModal>
    </Overlay>
  );
}

export default JoinConfirmModal;
