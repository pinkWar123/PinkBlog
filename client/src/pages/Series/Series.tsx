import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IPost, ISeries } from "../../types/backend";
import {
  fetchSeriesById,
  removePostFromSeries,
} from "../../services/seriesApi";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Layout,
  Modal,
  Row,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { formatDateWith } from "../../utils/formateDate";
import { PostItem } from "../../components/shared";
import Sider from "antd/es/layout/Sider";
import SeriesDebounceSelect, { PostValue } from "./SeriesDebounceSelect";
import ModalFooter from "../../components/shared/ModalFooter";
import AddPostModal from "./AddPostModal";
import { handleErrorMessage } from "../../utils/handleErrorMessage";
import UserStateContext from "../../context/users/UserContext";

const Series: React.FC = () => {
  const { id } = useParams();
  const { user } = useContext(UserStateContext);
  const navigate = useNavigate();
  const [series, setSeries] = useState<ISeries | undefined>();
  const [messageApi, contextHolder] = message.useMessage();
  const [showAddPostModal, setShowAddPostModal] = useState<boolean>(false);

  const handleUpdateSeries = useCallback(async () => {
    if (!id) return;
    const res = await fetchSeriesById(id);
    setSeries(res?.data?.data);
  }, [id]);

  useEffect(() => {
    handleUpdateSeries();
  }, [handleUpdateSeries]);

  const handleRemoveSeries = async (postId: string) => {
    if (!id) return;
    const res = await removePostFromSeries(id, [postId]);
    if (res && res.status === 201) {
      await handleUpdateSeries();
      message.success({ content: "Remove post succesfully" });
    } else handleErrorMessage(res, message);
  };

  if (!series) return <Empty />;

  return (
    <>
      {contextHolder}
      <Layout style={{ backgroundColor: "white" }}>
        <Layout>
          <Typography.Title>{series.title}</Typography.Title>
          <Typography.Title level={5}>
            <div
              style={{ maxWidth: "100%" }}
              // className={styles["content"]}
              dangerouslySetInnerHTML={{
                __html: series?.description ? series.description : "",
              }}
            />
          </Typography.Title>
          <Flex wrap="wrap">
            <div>
              {series?.tags?.map((item) => (
                <Tag
                  color={item?.color ? `#${item.color}` : "magenta"}
                  style={{ marginTop: "8px" }}
                >
                  {item.value}
                </Tag>
              ))}
            </div>
          </Flex>
          <Flex gap="small" style={{ marginTop: "12px" }}>
            <span style={{ color: "#9B9B9B" }}>
              <GlobalOutlined /> Xuất bản vào lúc{" "}
              {formatDateWith(series.createdAt)}
            </span>
            <span style={{ color: "#9B9B9B" }}>
              <EyeOutlined /> {series.viewCount ?? 0}
            </span>
          </Flex>
          <Row
            style={{ width: "100%", marginTop: "12px", paddingBottom: "50px" }}
          >
            <Col span={2} style={{ fontWeight: 600, fontSize: "18px" }}>
              Nội dung
            </Col>
            <Col
              span={user?._id === series?.createdBy?._id ? 16 : 22}
              style={{
                border: "1px solid #eee",
                height: "1px",
                marginTop: "12px",
              }}
            ></Col>
            {user?._id === series?.createdBy?._id && (
              <Col
                span={6}
                style={{ cursor: "pointer" }}
                onClick={() => setShowAddPostModal(true)}
              >
                <PlusOutlined /> Thêm bài viết vào series
              </Col>
            )}
          </Row>
          {series?.posts?.map((post) => (
            <>
              <PostItem
                title={post.title}
                createdAt={post.createdAt}
                createdBy={post.createdBy}
                tags={post.tags}
                viewCount={post.viewCount}
                onClick={() => navigate(`/posts/${post._id}`)}
                actions={
                  user?._id === post.createdBy._id
                    ? [
                        <DeleteOutlined
                          key="delete"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleRemoveSeries(post._id);
                          }}
                        />,
                      ]
                    : []
                }
              />
            </>
          ))}
        </Layout>
        <Sider width="30%" style={{ backgroundColor: "white" }}>
          <Card hoverable style={{ marginTop: "100px" }}>
            <Card.Meta
              avatar={<Avatar src={series?.createdBy?.profileImageUrl} />}
              title={
                <Flex justify="space-between">
                  <span>{series?.createdBy?.username}</span>
                  <Button type="primary">Đã theo dõi</Button>
                </Flex>
              }
              description={
                <Typography.Paragraph ellipsis={{ rows: 5 }}>
                  {series?.createdBy?.description}
                </Typography.Paragraph>
              }
            />
          </Card>
        </Sider>
        {showAddPostModal && (
          <AddPostModal
            onHide={() => setShowAddPostModal(false)}
            id={id}
            currentPosts={series?.posts?.map((post) => post._id) ?? []}
            onUpdate={handleUpdateSeries}
          />
        )}
      </Layout>
    </>
  );
};

export default Series;
