import { Avatar, Card, Tag } from "antd";
import styles from "./PostItem.module.scss";
const { Meta } = Card;
const PostItem: React.FC = () => {
  return (
    <div className={styles["post-item"]}>
      <Card hoverable style={{ marginTop: "12px" }}>
        <Meta
          avatar={<Avatar />}
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a>Hello world</a>
              <div
                style={{
                  color: "rgba(0,0,0,0.3)",
                  fontWeight: 500,
                  fontSize: "12px",
                  marginLeft: "24px",
                }}
              >
                Khoang 1h
              </div>
            </div>
          }
          description=<div style={{ color: "black", fontSize: "20px" }}>
            <ul style={{ padding: 0, margin: 0 }}>
              <li className={styles["post-title"]}>
                Từ câu chuyện kải kách chữ Quốc ngữ đến những nguyên lý trong
                lập trình
                {/* A list of tags of the post */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  <Tag color="magenta" className={styles["post-tag"]}>
                    Hello world
                  </Tag>
                  <Tag color="magenta" className={styles["post-tag"]}>
                    [Paper Explain] Mixtral of Experts: Lắm thầy thì model khỏe
                  </Tag>
                  <Tag color="magenta" className={styles["post-tag"]}>
                    Sử dụng Cobalt Strike cho Redteam (P1)
                  </Tag>
                  <Tag color="magenta" className={styles["post-tag"]}>
                    Hello world
                  </Tag>
                  <Tag color="magenta" className={styles["post-tag"]}>
                    Hello world
                  </Tag>
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
