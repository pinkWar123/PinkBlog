import { MouseEventHandler, useState } from "react";
import { RegisterSteps } from "../../components/shared";
import {
  ProfileUpload,
  Success,
  UserInfo,
} from "../../components/shared/register";
import { Card } from "antd";
import { RegisterContextProvider } from "../../context/register";

const Register: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const onNext = () => {
    setCurrent((prev) => prev + 1);
  };
  const onPrevious = () => setCurrent((prev) => prev - 1);
  const renderRegisterContent = (current: number) => {
    switch (current) {
      case 0:
        return <UserInfo onNext={onNext} />;
      case 1:
        return <ProfileUpload onNext={onNext} onPrev={onPrevious} />;
      case 2:
        return <Success />;
    }
  };
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#eee",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <RegisterSteps current={current} />
      <div
        style={{
          margin: "auto",
          alignContent: "center",
          width: "50%",
          minWidth: "400px",
          marginTop: "200px",
        }}
      >
        <Card
          style={{
            margin: "auto",
            alignContent: "center",
            width: "100%",
            minWidth: "400px",
          }}
        >
          <RegisterContextProvider>
            {renderRegisterContent(current)}
          </RegisterContextProvider>
        </Card>
      </div>
    </div>
  );
};

export default Register;

export type SingleProps = {
  onNext: Function;
};

export type DoubleProps = {
  onNext: MouseEventHandler<HTMLElement>;
  onPrev: MouseEventHandler<HTMLElement>;
};
