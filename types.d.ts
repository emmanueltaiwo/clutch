export interface User {
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePic: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  interests: string[];
  status?: boolean;
  username: string;
}

export type Post = {
  postId: string;
  userId: string;
  post: string;
  postImage?: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  createdAtString: string;
  updatedAtString: string;
  totalLikes: number;
  hasLikePost: boolean;
  user: {
    username: string;
    fullName: string;
    profilePic: string;
    country: string;
  };
};

export type Follower = {
  userId: string;
  fullName: string;
  profilePic: string;
  gender: string;
  country: string;
  interests: string[];
};

export type LikedPost = {
  likeId: string;
  userId: string;
  postId: string;
  likeCreatedAt: number;
};

export type Comment = {
  commentId: string;
  userId: string;
  postId: string;
  commentText: string;
  createdAt: number;
  updatedAt: number;
  createdAtString: string;
  updatedAtString: string;
  user: {
    fullName: string;
    profilePic: string;
    country: string;
  };
};
