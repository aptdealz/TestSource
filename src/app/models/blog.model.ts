export interface Blog {
  blogId: string;
  title: string;
  image: string;
  description: string;
  author: string;
  date: string;
  createdBy: string;
  created: string;
  lastModifiedBy?: string;
  lastModified?: string;
  isDeleted: boolean;
}
export interface AddBlogCommentResponse {
  succeeded: boolean;
  message: string;
  errors?: any;
  data: string;
}

export interface AddBlogCommentRequest {
  comments: string;
  blogId: string;
  userId: string;
}

export interface BlogComment {
  commentId: string;
  blogId: string;
  userId: string;
  comments: string;
  userProfile: CommentorProfile;
  createdBy: string;
  created: string;
  lastModifiedBy?: string;
  lastModified?: string;
  isDeleted: boolean;
}

interface CommentorProfile {
  fullName: string;
  profilePhoto: string;
}

export interface BlogResponse {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  succeeded: boolean;
  message: string;
  errors?: any;
  data: Blog[];
}

export interface GetBlogsRequest {
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
}
