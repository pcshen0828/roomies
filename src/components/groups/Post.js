import React from "react";
import styled from "styled-components";
import api from "../../utils/api";
import {
  Bold,
  FlexColumn,
  FlexWrapper,
  ProfileImage,
} from "../common/Components";
import { calcTimeGap } from "../../utils/calculate";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import ImagesDisplayer from "./ImagesDisplayer";
import more from "../../images/dots.svg";
import { Link } from "react-router-dom";
import edit from "../../images/edit.svg";
import drop from "../../images/delete.svg";
import ConfirmBeforeActionModal from "../modals/ConfirmBeforeAction";
import { Firebase } from "../../utils/firebase";
import EditPostModal from "../modals/EditPost";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Wrapper = styled(FlexColumn)`
  width: 100%;
  background: #fff;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  position: relative;
  overflow: hidden;
  padding-bottom: 20px;
`;

const NewProfile = styled(ProfileImage)`
  width: 45px;
  height: 45px;
  margin-right: 10px;
`;

const TopInfo = styled(FlexWrapper)`
  width: calc(100% - 40px);
  padding: 20px;
`;

const NameTime = styled(FlexColumn)`
  align-items: flex-start;
`;

const DetailTime = styled(FlexWrapper)`
  justify-content: center;
  width: 135px;
  padding: 10px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.5s ease;
  position: absolute;
  top: 25px;
  left: -60px;
`;

const SubtitleSmall = styled.div`
  font-size: 14px;
  color: #a1aeb7;
  cursor: pointer;
  position: relative;
  &:hover {
    ${DetailTime} {
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  width: calc(100% - 40px);
  padding: 0 0 20px;
  line-height: 150%;
  white-space: pre-line;
`;

const MoreContent = styled.span`
  margin: 0 2px 0 3px;
`;

const ShowMoreButton = styled.span`
  cursor: pointer;
  font-weight: 700;
  &:hover {
    text-decoration: underline;
  }
`;

const SinglemageDisplayer = styled.img`
  width: calc(100% - 4px);
  height: auto;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  border: 2px solid #fff;
`;

const TwoImagesDisplayer = styled(FlexWrapper)`
  width: 100%;
  height: 300px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
`;

const MultiImageDisplayer = styled(FlexColumn)`
  width: 100%;
  height: 480px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  @media screen and (max-width: 575.98px) {
    height: 300px;
  }
`;

const FirstImage = styled.div`
  width: calc(100% - 4px);
  height: 65%;
  border: 1px solid #e8e8e8;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid #fff;
`;

const MultiImages = styled(FlexWrapper)`
  width: 100%;
  height: 35%;
  border: 1px solid #e8e8e8;
`;

const MultiImage = styled.div`
  width: ${(props) =>
    props.count >= 3
      ? `calc(100% / ${props.count - 1})`
      : `calc(100% / ${props.count})`};
  height: 100%;
  background: ${(props) => (props.src ? `url(${props.src})` : "")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid #fff;
  position: ${(props) => (props.last ? "relative" : "static")};
`;

const ShowMoreImage = styled(FlexWrapper)`
  width: 100%;
  height: 100%;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  position: absolute;
  top: 0;
  left: 0;
  @media screen and (max-width: 575.98px) {
    font-size: 24px;
  }
`;

const MoreButton = styled(FlexWrapper)`
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#e8e8e8" : "#fff")};
  &:hover {
    background: #e8e8e8;
  }
`;

const More = styled.img`
  width: 20px;
`;

const MoreModal = styled(FlexColumn)`
  width: 200px;
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.06);
  position: absolute;
  top: 40px;
  right: 0;
  opacity: ${(props) => (props.active ? "1" : "0")};
  display: ${(props) => (props.active ? "flex" : "none")};
  transition: all 0.1s ease;
  cursor: default;
`;

const EditButton = styled(FlexWrapper)`
  background: #fff;
  color: #424b5a;
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;

  &:hover {
    background: #e8e8e8;
  }
  @media screen and (max-width: 767.98px) {
    font-size: 14px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const tester =
  "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/posts%2Fea101c0e-c283-4d43-9927-28fe27912e46%2Fgood.png?alt=media&token=8a6792c0-ded4-4f1f-abda-6a932a108b04";
const defaultImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/roomies-f03cd.appspot.com/o/apartments%2Fdefault%2Fimgplaceholder.png?alt=media&token=603bce20-3d5b-489f-9ffa-98ee2a3f8aba";

export default function Post({ post, currentUser, setUpdated, setDeleted }) {
  const [creatorInfo, setCreatorInfo] = React.useState({});
  const [showMore, setShowMore] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [showImages, setShowImages] = React.useState(false);
  const defaultContentLength = 100;

  const [loading, setLoading] = React.useState(true);

  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  React.useEffect(() => {
    api
      .getDataWithSingleQuery("users", "uid", "==", post.creator)
      .then((res) => {
        setCreatorInfo(res[0]);
        setLoading(false);
      });
  }, []);

  function deletePost() {
    Firebase.deleteDoc(Firebase.doc(Firebase.db, "posts", post.id));
    if (post.images.length) {
      let promises = [];
      post.images.forEach((image) => {
        const desertRef = Firebase.ref(
          Firebase.storage,
          `posts/${post.id}/${image.name}`
        );
        promises.push(
          Firebase.deleteObject(desertRef)
            .then(() => {
              console.log("deleted");
            })
            .catch((error) => {
              console.log(error);
            })
        );
      });
      Promise.all(promises).then((res) => {
        setDeleted(true);
        return;
      });
    }
    setDeleted(true);
  }

  return loading ? (
    <div width="100%">
      <Skeleton width="100%" height={450} borderRadius={10} />
    </div>
  ) : (
    <Wrapper
      onClick={() => {
        setShowMore(false);
      }}
    >
      {openEdit && (
        <EditPostModal
          post={post}
          toggle={setOpenEdit}
          currentUser={currentUser}
          setUpdated={setUpdated}
        />
      )}
      {openDeleteConfirm && (
        <ConfirmBeforeActionModal
          message="確認刪除？"
          toggle={setOpenDeleteConfirm}
          action={deletePost}
        />
      )}
      {showImages && (
        <ImagesDisplayer images={post.images} toggle={setShowImages} />
      )}

      <TopInfo>
        {creatorInfo.role === 1 ? (
          <Link to={`/users/${creatorInfo.uid}`}>
            <NewProfile src={creatorInfo.profileImage} />
          </Link>
        ) : (
          <NewProfile src={creatorInfo.profileImage} />
        )}
        <NameTime>
          <Bold>{creatorInfo.alias}</Bold>
          <SubtitleSmall>
            {calcTimeGap(post.updateTime.toDate())}
            <DetailTime>
              {new Date(post.updateTime.toDate()).toLocaleString().slice(0, -3)}
            </DetailTime>
          </SubtitleSmall>
        </NameTime>
        {post.creator === currentUser.uid && (
          <MoreButton
            active={showMore}
            onClick={(e) => {
              e.stopPropagation();
              setShowMore((prev) => !prev);
            }}
          >
            <More src={more} />
            {
              <MoreModal active={showMore} onClick={(e) => e.stopPropagation()}>
                <EditButton
                  onClick={() => {
                    setOpenEdit(true);
                  }}
                >
                  <Icon src={edit} />
                  編輯貼文
                </EditButton>
                <EditButton
                  onClick={() => {
                    setOpenDeleteConfirm(true);
                  }}
                >
                  <Icon src={drop} />
                  刪除貼文
                </EditButton>
              </MoreModal>
            }
          </MoreButton>
        )}
      </TopInfo>

      <Content>
        {showContent
          ? `${post.content}`
          : post.content.slice(0, defaultContentLength)}
        {!showContent && post.content.length > defaultContentLength && (
          <MoreContent>
            ......{" "}
            <ShowMoreButton
              onClick={() => {
                setShowContent(true);
              }}
            >
              顯示更多
            </ShowMoreButton>
          </MoreContent>
        )}
      </Content>

      {/* <LinkPreview
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        width="100%"
        borderColor="#e8e8e8"
        borderRadius="0px 0px 10px 10px"
        fallbackImageSrc={defaultImageUrl}
      /> */}

      {post.images.length === 1 ? (
        post.images.map((image) => (
          <SinglemageDisplayer
            key={image.url}
            src={image.url}
            onClick={() => {
              setShowImages(true);
            }}
          />
        ))
      ) : post.images.length === 2 ? (
        <TwoImagesDisplayer>
          {post.images.map((image) => (
            <MultiImage
              key={image.url}
              src={image.url}
              count={2}
              onClick={() => {
                setShowImages(true);
              }}
            />
          ))}
        </TwoImagesDisplayer>
      ) : post.images.length === 3 ? (
        <MultiImageDisplayer>
          <>
            <FirstImage
              src={post.images[0].url}
              onClick={() => {
                setShowImages(true);
              }}
            />
            <MultiImages>
              {post.images.slice(1, 3).map((image) => (
                <MultiImage
                  key={image.url}
                  src={image.url}
                  count={post.images.length}
                  onClick={() => {
                    setShowImages(true);
                  }}
                />
              ))}
            </MultiImages>
          </>
        </MultiImageDisplayer>
      ) : post.images.length > 3 ? (
        <MultiImageDisplayer>
          <>
            <FirstImage
              src={post.images[0].url}
              onClick={() => {
                console.log(123);
                setShowImages(true);
              }}
            />
            <MultiImages>
              {post.images.slice(1, 4).map((image, index) => (
                <MultiImage
                  key={image.url}
                  src={image.url}
                  count={post.images.length - 1}
                  last={index === 2}
                  onClick={() => {
                    setShowImages(true);
                  }}
                >
                  {index === 2 && (
                    <ShowMoreImage
                      onClick={() => {
                        setShowImages(true);
                      }}
                    >
                      {" "}
                      + {post.images.length - 3}
                    </ShowMoreImage>
                  )}
                </MultiImage>
              ))}
            </MultiImages>
          </>
        </MultiImageDisplayer>
      ) : (
        ""
      )}
    </Wrapper>
  );
}
