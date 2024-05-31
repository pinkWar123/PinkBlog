import { Avatar, Card, Tag, Tooltip } from "antd";
import styles from "./PostItem.module.scss";
import { IPost, ITag } from "../../../types/backend";
import { getFormatDate } from "../../../utils/formateDate";
import { MouseEventHandler } from "react";
import { EyeOutlined } from "@ant-design/icons";
const { Meta } = Card;

interface IProps {
  title: string;
  createdBy: {
    username: string;
    _id: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  tags: ITag[];
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  actions?: React.ReactElement[];
  viewCount: number;
}

const PostItem: React.FC<IProps> = ({
  title,
  createdBy,
  createdAt,
  tags,
  viewCount,
  actions,
  onClick,
}) => {
  return (
    <div className={styles["post-item"]} onClick={onClick}>
      <Card style={{ marginTop: "12px", width: "95%" }} actions={actions}>
        <Meta
          avatar={
            <Avatar
              src={
                createdBy?.profileImageUrl
                  ? createdBy.profileImageUrl
                  : "https://placehold.co/600x400"
              }
            />
          }
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "10px",
                flexWrap: "wrap",
              }}
            >
              <a
                style={{ textAlign: "center" }}
                href={`/profile/${createdBy._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                {createdBy?.username}
              </a>
              <div
                style={{
                  color: "rgba(0,0,0,0.3)",
                  fontWeight: 500,
                  fontSize: "12px",
                  marginLeft: "24px",
                }}
              >
                <p>{getFormatDate(createdAt)}</p>
              </div>
            </div>
          }
          description=<div style={{ color: "black", fontSize: "20px" }}>
            <ul style={{ padding: 0, margin: 0 }}>
              <li className={styles["post-title"]}>
                {title}
                {/* A list of tags of the post */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {tags.length > 0 &&
                    tags.map((tag) => {
                      return (
                        <Tag
                          color={tag?.color ? `#${tag.color}` : "magenta"}
                          className={styles["post-tag"]}
                        >
                          {tag.value}
                        </Tag>
                      );
                    })}
                </div>
                <div style={{ fontSize: "16px" }}>
                  <Tooltip title="Lượt xem">
                    <EyeOutlined /> {viewCount}
                  </Tooltip>
                </div>
              </li>
            </ul>
          </div>
        />
      </Card>
    </div>
  );
};

export default PostItem;
