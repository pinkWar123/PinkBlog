import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Success: React.FC = () => {
  const navigate = useNavigate();
  return (
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
  );
};

export default Success;
