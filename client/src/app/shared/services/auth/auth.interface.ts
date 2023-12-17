export interface UserResponse {
  message: string;
  user: UserInfo;
}

export interface UserCredentials {
  username: string,
  password: string,
  file?: File
}

export interface UserInfo {
  _id: string;
  username: string;
  subscribers: string[];
  subscribed: string[];
  likedVideos: string[];
  dislikedVideos: string[];
  file?: File;
  profilePictureUrl?: string;
}