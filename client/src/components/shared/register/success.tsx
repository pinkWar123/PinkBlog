import { Button, Result, Skeleton, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterStateContext from "../../../context/register/RegisterContext";
import { register } from "../../../services/authApi";
import { CloseCircleOutlined } from "@ant-design/icons";
import UserStateContext from "../../../context/users/UserContext";

const { Paragraph, Text } = Typography;

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const { user } = useContext(UserStateContext);
  useEffect(() => {
    setSuccess(user ? true : false);
  }, [user]);
  return (
    <>
      {isSuccess && (
        <Result
          status="success"
          title="You have finished all steps in registering a new account!"
          subTitle="Thanks for joining us. Please hit the button below to be redirected to the home page"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Back to home page
            </Button>,
          ]}
        />
      )}
      {!isSuccess && (
        <Result
          status="error"
          title="Submission Failed"
          subTitle="There may be some errors in the registration process. Please try again!"
          extra={[
            <Button
              key="buy"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Back to home page
            </Button>,
          ]}
        >
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                The content you submitted has the following error:
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Your account has been frozen. <a>Thaw immediately &gt;</a>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Your account is not yet eligible to apply.{" "}
              <a>Apply Unlock &gt;</a>
            </Paragraph>
          </div>
        </Result>
      )}
    </>
  );
};

export default Success;
