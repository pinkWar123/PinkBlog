import {
  Button,
  GetProp,
  Progress,
  Space,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { useContext, useState } from "react";
import { DoubleProps } from "../../../pages/auth/register";
import ImgCrop from "antd-img-crop";
import { uploadSingleFile } from "../../../services/uploadApi";
import RegisterStateContext from "../../../context/register/RegisterContext";
import { UserRegisterDto } from "../../../types/auth";
import { register } from "../../../services/authApi";
import UserStateContext from "../../../context/users/UserContext";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const ProfileUpload: React.FC<DoubleProps> = ({ onNext, onPrev }) => {
  const { registerInfo, setRegisterInfo } = useContext(RegisterStateContext);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const { setUser } = useContext(UserStateContext);
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleUploadPhoto = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        folder_type: "profile",
      },
      onUploadProgress: (event: any) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    try {
      const res = await uploadSingleFile(file, "profile", config);
      onSuccess("Ok");

      setRegisterInfo((user: UserRegisterDto | undefined) => {
        if (!user) return user;
        return {
          ...user,
          profileImageUrl: res?.data?.data?.url,
          profileImageKey: res?.data?.data?.key,
        };
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1 style={{ textAlign: "center" }}>Upload your profile photo</h1>
        <h4 style={{ textAlign: "center" }}>You can skip it</h4>
      </div>
      <div>
        <ImgCrop rotationSlider>
          <Upload
            accept="image/*"
            listType="picture-card"
            customRequest={handleUploadPhoto}
            defaultFileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
            maxCount={1}
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </ImgCrop>
        {progress > 0 ? <Progress percent={progress} /> : null}
        <Space>
          <Button
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
              setRegisterInfo((prev: UserRegisterDto | undefined) => {
                if (!prev) return prev;
                return { ...prev, profileImageUrl: undefined };
              });
              onPrev(e);
            }}
          >
            Previous
          </Button>
          <Button
            type="primary"
            onClick={async (e: any) => {
              const res = await register(registerInfo);
              if (res?.status === 201) {
                setUser(res.data.data);
                const accessToken = res.data.data?.accessToken;
                if (accessToken)
                  localStorage.setItem("access_token", accessToken);
              }
              onNext(e);
            }}
          >
            Next
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ProfileUpload;
