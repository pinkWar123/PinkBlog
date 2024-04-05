import { Button, Result, Skeleton, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterStateContext from "../../../context/register/RegisterContext";
import { register } from "../../../services/authApi";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const { registerInfo, setRegisterInfo } = useContext(RegisterStateContext);
  useEffect(() => {
    const createAccount = async () => {
      const res = await register(registerInfo);
      console.log(registerInfo);
      if (res?.data.statusCode === 201) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setLoading(false);
    };
    createAccount();
  }, [registerInfo]);
  return (
    <Skeleton loading={loading} active>
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
                navigate("/");
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
                navigate("/");
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
    </Skeleton>
  );
};

export default Success;
