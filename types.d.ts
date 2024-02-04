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
}

export type Post = {
  postId: string;
  userId: string;
  post: string;
  postImage?: string;
  category: string;
  createdAt: number;
  createdAtString: string;
  user: {
    fullName: string;
    profilePic: string;
    country: string;
  };
};
