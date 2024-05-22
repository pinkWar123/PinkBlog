import { Button, Flex, Form } from "antd";

interface ModalFooterProps {
  onHide: () => void;
  cancelText?: string;
  okText?: string;
  loading: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onHide,
  cancelText = "Cancel",
  okText = "Submit",
  loading,
}) => {
  return (
    <Flex justify="flex-end" gap="small">
      <Form.Item>
        <Button type="dashed" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {okText}
        </Button>
      </Form.Item>
    </Flex>
  );
};

export default ModalFooter;
