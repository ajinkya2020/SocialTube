export interface UserResponse {
  message: string;
  user: UserInfo;
}

export interface UserCredentials {
  username: string,
  password: string
}

export interface UserInfo {
  id: string;
  username: string;
  subscribers: string[],
  subscribed: string[],
  likedVideos: string[],
  dislikedVideos: string[]
}