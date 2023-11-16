export interface UserResponse {
  message: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
}