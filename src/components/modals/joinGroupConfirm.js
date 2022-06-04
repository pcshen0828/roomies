import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import styled from "styled-components";
import {
  Overlay,
  Modal,
  Header,
  CloseButton,
  Title,
  Body,
  Button,
} from "./ModalElements";
import { FlexWrapper } from "../common/Components";

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

const ConfirmBlock = styled(FlexWrapper)``;

const Checkbox = styled.input`
  margin-left: 20px;
`;

function JoinConfirmModal({ toggle, apartmentId, groupId }) {
  const { currentUser } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  function joinGroup() {
    if (!isConfirmed) return;
    api
      .getDataWithSingleQuery("groups", "apartmentId", "==", apartmentId)
      .then((groups) => {
        if (groups.length) {
          const group = groups[0];
          const currentMembers = group.members.length
            ? [...group.members, currentUser.uid]
            : [currentUser.uid];
          api.updateDocData("groups", group.id, {
            members: currentMembers,
          });
          navigate(`/groups/${groupId}`);
        } else {
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
          <CloseButton onClick={toggle}>×</CloseButton>
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

JoinConfirmModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  apartmentId: PropTypes.string.isRequired,
  groupId: PropTypes.string,
};

export default JoinConfirmModal;
