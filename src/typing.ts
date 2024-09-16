export interface Post {
  id: string
  username: string
  content: string
  post_url: string
  indexed_at: Date
  attachments: Attachment[]
  author_id: string
}

export interface Attachment {
  id: string
  url: string
  description: string
}

export interface User {
  id: string
  username: string
  url: string
  posts: Post[]
  total_posts: number
}
