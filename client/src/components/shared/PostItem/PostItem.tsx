import { Avatar, Card, Tag } from "antd";
import styles from "./PostItem.module.scss";
import { IPost } from "../../../types/backend";
import { getFormatDate } from "../../../utils/formateDate";
import { MouseEventHandler } from "react";
const { Meta } = Card;

interface IProps {
  title: string;
  createdBy: {
    username: string;
    _id: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  tags: { _id: string; value: string }[];
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

const PostItem: React.FC<IProps> = ({
  title,
  createdBy,
  createdAt,
  tags,
  onClick,
}) => {
  return (
    <div className={styles["post-item"]} onClick={onClick}>
      <Card hoverable style={{ marginTop: "12px", width: "95%" }}>
        <Meta
          avatar={
            <Avatar
              src={
                createdBy.profileImageUrl
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
              <div style={{ textAlign: "center" }}>{createdBy.username}</div>
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
                        <Tag color="magenta" className={styles["post-tag"]}>
                          {tag.value}
                        </Tag>
                      );
                    })}
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
