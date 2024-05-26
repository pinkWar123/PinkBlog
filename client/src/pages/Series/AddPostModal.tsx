import { Form, Modal, message } from "antd";
import SeriesDebounceSelect, { PostValue } from "./SeriesDebounceSelect";
import ModalFooter from "../../components/shared/ModalFooter";
import { useState } from "react";
import { addPostsToSeries } from "../../services/seriesApi";
import { handleErrorMessage } from "../../utils/handleErrorMessage";

interface AddPostModalProps {
  currentPosts?: string[];
  onHide: () => void;
  onUpdate?: () => Promise<void>;
  id: string | undefined;
}

const AddPostModal: React.FC<AddPostModalProps> = ({
  currentPosts,
  onHide,
  onUpdate,
  id,
}) => {
  const [newPosts, setNewPosts] = useState<PostValue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = async () => {
    if (!id) return;
    setLoading(true);
    console.log(newPosts?.map((newPost) => newPost.value));
    const res = await addPostsToSeries(
      id,
      newPosts?.map((newPost) => newPost.value)
    );
    if (res?.status === 201) {
      message.success({ content: "Add tags successfully" });
    } else handleErrorMessage(res, message);
    if (onUpdate) await onUpdate();
    setLoading(false);
    onHide();
  };

  return (
    <>
      {contextHolder}
      <Modal open title="Add new post to your series" footer={<></>}>
        <Form>
          <Form.Item label="Your post:" required>
            <SeriesDebounceSelect
              posts={newPosts}
              setPosts={setNewPosts}
              currentPosts={currentPosts ?? []}
            />
          </Form.Item>
        </Form>
        <ModalFooter
          onHide={onHide}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};

export default AddPostModal;
