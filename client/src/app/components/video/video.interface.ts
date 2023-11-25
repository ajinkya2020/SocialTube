export interface VideoDto {
  desc: string,
  title: string,
  userId?: string,
  username?: string,
  likes?: number,
  dislikes?: number,
  videoUrl?: string,
  viewsCount?: number
}