import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { QuerySnapshot } from "firebase/firestore";

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 50%;
  overflow-y: scroll;
  background: #fff;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.div`
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`;

const Header = styled.div`
  padding: 15px 20px 10px;
  border-bottom: 1px solid #dadada;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: 700;
`;

const Body = styled.div`
  width: calc(100% - 40px);
  border: 1px solid #dadada;
  height: 250px;
  overflow-y: scroll;
  margin: 20px auto;
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

const ConfirmJoinButton = styled.button`
  align-self: end;
  margin: 20px 20px 40px 0;
`;

function JoinConfirmModal({ setIsActive, apartmentId, uid }) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  async function joinGroup() {
    if (!isConfirmed) return;
    // 2. redirect to the group page
    const query = Firebase.query(
      Firebase.collection(Firebase.db, "groups"),
      Firebase.where("apartmentId", "==", apartmentId)
    );
    const querySnapShot = await Firebase.getDocs(query);
    const groupData = querySnapShot.docs.map((doc) => doc.data())[0];

    Firebase.updateDoc(Firebase.doc(Firebase.db, "groups", groupData.id), {
      members: [...groupData.members, uid],
    });
  }

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>租屋說明</Title>
          <CloseButton onClick={() => setIsActive(false)}>×</CloseButton>
        </Header>
        <Body>
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
        </Body>
        <ConfirmBlock>
          <Checkbox
            id="confirm"
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <label htmlFor="confirm">我已詳閱並同意以上租屋流程及須知</label>
        </ConfirmBlock>
        <ConfirmJoinButton onClick={joinGroup}>加入</ConfirmJoinButton>
      </Modal>
    </Overlay>
  );
}

export default JoinConfirmModal;
