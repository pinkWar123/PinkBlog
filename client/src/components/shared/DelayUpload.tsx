import { Upload, UploadFile } from "antd";

interface DelayUploadProps {
  fileList: UploadFile<any>[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  maxCount?: number;
}

const DelayUpload: React.FC<DelayUploadProps> = ({
  fileList,
  setFileList,
  maxCount,
}) => {
  return (
    <Upload
      accept="image/*"
      listType="picture-card"
      defaultFileList={fileList}
      fileList={fileList}
      maxCount={maxCount ?? 1}
      beforeUpload={(file) => {
        setFileList([file]);
        return false;
      }}
      onRemove={(file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
      }}
    >
      +Upload
    </Upload>
  );
};

export default DelayUpload;
