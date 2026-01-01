import type { Request, Response } from 'express'
import { PostService } from './post.service'

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.ceratePostIntoDb(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error })
  }
}

export const PostController = {
  createPost
}
