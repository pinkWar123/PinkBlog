import { Avatar } from "antd";

interface IProps {
  size?: number;
  src?: string;
  username?: string;
}

const UserAvatar: React.FC<IProps> = ({ size, src, username }) => {
  return src ? (
    <Avatar
      size={size}
      crossOrigin="anonymous"
      src={`http://localhost:8000/public/images/profile/${src}`}
    />
  ) : (
    <Avatar size={size}>{username}</Avatar>
  );
};

export default UserAvatar;
