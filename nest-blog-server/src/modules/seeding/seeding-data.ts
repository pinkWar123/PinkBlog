import { CreateRoleDto } from '@modules/roles/dto/create-role.dto';
import { Role } from '@modules/roles/schemas/role.schema';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';

interface IPermission {
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export const INIT_PERMISSIONS = [
  {
    module: 'USERS',
    children: [
      {
        method: 'POST',
        apiPath: '/users',
        name: 'Create a new user',
      },
      {
        method: 'GET',
        apiPath: '/users',
        name: 'Get a list of users with pagination',
      },
      {
        method: 'GET',
        apiPath: '/users/:id',
        name: 'Get user by id',
      },
      {
        method: 'PATCH',
        apiPath: '/users/:id',
        name: 'Update a user by id',
      },
      {
        method: 'DELETE',
        apiPath: '/users/:id',
        name: 'Delete a user by id',
      },
      {
        method: 'GET',
        apiPath: '/users/:id/followers',
        name: 'Get followers of user by id',
      },
      {
        method: 'POST',
        apiPath: '/users/follow/:id',
        name: 'Follow/unfollow user by id',
      },
    ],
  },
  {
    module: 'ROLES',
    children: [
      {
        method: 'POST',
        apiPath: '/roles',
        name: 'Create a new role',
      },
      {
        method: 'GET',
        apiPath: '/roles',
        name: 'Get roles with pagination',
      },
      {
        method: 'GET',
        apiPath: '/roles/:id',
        name: 'Get role by id',
      },
      {
        method: 'PATCH',
        apiPath: '/roles/:id',
        name: 'Update a role by id',
      },
      {
        method: 'DELETE',
        apiPath: '/roles/:id',
        name: 'Delete role by id',
      },
    ],
  },
  {
    module: 'UPLOAD',
    children: [
      {
        method: 'POST',
        apiPath: '/upload',
        name: 'Upload a file',
      },
      {
        method: 'DELETE',
        apiPath: '/upload',
        name: 'Delete a file',
      },
    ],
  },
  {
    module: 'TAGS',
    children: [
      {
        method: 'POST',
        apiPath: '/tags',
        name: 'Create a new tag',
      },
      {
        method: 'GET',
        apiPath: '/tags',
        name: 'Get tags with pagination',
      },
      {
        method: 'GET',
        apiPath: '/tags/:id',
        name: 'Get tag by id',
      },
      {
        method: 'PATCH',
        apiPath: '/tags/:id',
        name: 'Update tag by id',
      },
      {
        method: 'DELETE',
        apiPath: '/tags/:id',
        name: 'Delete a tag by id',
      },
    ],
  },
  {
    module: 'POSTS',
    children: [
      {
        method: 'POST',
        apiPath: '/posts',
        name: 'Create a new post',
      },
      {
        method: 'GET',
        apiPath: '/posts',
        name: 'Get posts with pagination',
      },
      {
        method: 'GET',
        apiPath: '/posts/:id',
        name: 'Get post by id',
      },
      {
        method: 'PATCH',
        apiPath: '/posts/:id',
        name: 'Update post by id',
      },
      {
        method: 'DELETE',
        apiPath: '/posts/:id',
        name: 'Delete a post by id',
      },
      {
        method: 'POST',
        apiPath: '/posts/upvote',
        name: 'Upvote a post',
      },
      {
        method: 'POST',
        apiPath: '/posts/downvote',
        name: 'Downvote a post',
      },
    ],
  },
  {
    module: 'COMMENTS',
    children: [
      {
        method: 'POST',
        apiPath: '/comments',
        name: 'Create a new comment',
      },
      {
        method: 'GET',
        apiPath: '/comments',
        name: 'Get comments with pagination',
      },
      {
        method: 'GET',
        apiPath: '/comments/posts/:targetId',
        name: 'Get commments of a post by id with pagination',
      },
      {
        method: 'POST',
        apiPath: '/comments/multiple',
        name: 'Get list of comments by list of ids',
      },
      {
        method: 'POST',
        apiPath: '/comments/upvote',
        name: 'Upvote a comment',
      },
      {
        method: 'POST',
        apiPath: '/comments/downvote',
        name: 'Downvote a new comment',
      },
      {
        method: 'GET',
        apiPath: '/comments/:id',
        name: 'Get comment by id',
      },
      {
        method: 'PATCH',
        apiPath: '/comments/:id',
        name: 'Update a comment by id',
      },
      {
        method: 'DELETE',
        apiPath: '/comments/:id',
        name: 'Delete a comment by id',
      },
    ],
  },
  {
    module: 'PERMISSIONS',
    children: [
      {
        method: 'POST',
        apiPath: '/permissions',
        name: 'Create a new permission',
      },
      {
        method: 'GET',
        apiPath: '/permissions',
        name: 'Get permissions with pagination',
      },
      {
        method: 'POST',
        apiPath: '/permissions/:id',
        name: 'Get permission by id',
      },
      {
        method: 'PATCH',
        apiPath: '/permissions/:id',
        name: 'Update permission by id',
      },
      {
        method: 'DELETE',
        apiPath: '/permissions/:id',
        name: 'Delete permission by id',
      },
    ],
  },
];

export const ADMIN_USER: CreateUserDto = {
  username: 'ROOT_ADMIN',
  email: 'nquan003@gmail.com',
  description: ' This is the root admin account',
  age: 20,
};

export const NORMAL_USER: CreateUserDto = {
  username: 'FIRST USER',
  email: 'nquan004@gmail.com',
  desription: 'This is the first user account',
  age: 20,
};

export const INIT_USERS = [ADMIN_USER, NORMAL_USER];

export const INIT_ADMIN_ROLE: CreateRoleDto = {
  name: 'ADMIN',
  description: 'This is the admin role',
  isActive: true,
  permissions: [],
};

export const INIT_USER_ROLE: CreateRoleDto = {
  name: 'USER',
  description: 'This is the user role',
  isActive: true,
  permissions: [],
};
