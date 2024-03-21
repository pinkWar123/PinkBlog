import { Avatar, Card, Tag } from "antd";

const { Meta } = Card;
const PostItem: React.FC = () => {
  return (
    <>
      <Card hoverable style={{ marginTop: "12px" }}>
        <Meta
          avatar={<Avatar />}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
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
              <li>
                Từ câu chuyện kải kách chữ Quốc ngữ đến những nguyên lý trong
                lập trình
                {/* A list of tags of the post */}
                <div>
                  <Tag color="magenta">Hello world</Tag>
                  <Tag color="magenta">
                    [Paper Explain] Mixtral of Experts: Lắm thầy thì model khỏe
                  </Tag>
                  <Tag color="magenta">
                    Sử dụng Cobalt Strike cho Redteam (P1)
                  </Tag>
                  <Tag color="magenta">Hello world</Tag>
                  <Tag color="magenta">Hello world</Tag>
                </div>
              </li>
            </ul>
          </div>
        />
      </Card>
    </>
  );
};

export default PostItem;
