import {
  FacebookOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Divider, Input, Row } from "antd";
import { Form } from "antd";
import { Link } from "react-router-dom";

const onFinish = (value: any) => {
  console.log(value);
};

const Auth: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#eee",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          margin: "auto",
          alignContent: "center",
          width: "30%",
          minWidth: "400px",
        }}
      >
        <Card>
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                paddingBottom: "24px",
              }}
            >
              Đăng nhập
            </div>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item style={{ width: "100%" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: "100%" }}
                >
                  Log in
                </Button>
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Checkbox>Remember me</Checkbox>
                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                </div>
              </Form.Item>

              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ margin: " auto" }}>
                  <Link to="/auth/register" style={{ textAlign: "center" }}>
                    Or register now!
                  </Link>
                </div>
              </Form.Item>
            </Form>

            <Row style={{ display: "flex" }}>
              <Col span={8} style={{ textAlign: "center" }}>
                <Divider />
              </Col>
              <Col
                span={8}
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Đăng nhập bằng
              </Col>
              <Col span={8}>
                <Divider />
              </Col>
            </Row>

            <Form.Item style={{ padding: "8px 0" }}>
              <Row>
                <Col
                  span={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button style={{ flex: 1 }}>
                    <GoogleOutlined />
                    Google
                  </Button>
                </Col>

                <Col
                  span={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button style={{ flex: 1 }}>
                    <FacebookOutlined />
                    Facebook
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
