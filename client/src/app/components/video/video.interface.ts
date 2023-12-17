export interface VideoDto {
  _id: string,
  desc: string,
  title: string,
  userId?: string,
  username?: string,
  likes?: number,
  dislikes?: number,
  videoUrl?: string,
  viewsCount?: number,
  comments?: CommentDto[]
}

export interface CommentDto {
  username: string,
  comment: string
}