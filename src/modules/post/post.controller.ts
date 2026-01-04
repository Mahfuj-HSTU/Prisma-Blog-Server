import type { Request, Response } from 'express'
import { PostService } from './post.service'

const createPost = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const result = await PostService.ceratePostIntoDb(req.body, req.user.id)
		res.status(201).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

const getAllPost = async (req: Request, res: Response) => {
	try {
		const { search, tags } = req.query
		const tagsArray = tags ? (tags as string)?.split(',') : []
		const result = await PostService.getAllPostFromDb({
			search: search as string,
			tags: tagsArray
		})
		res.status(200).json({
			success: true,
			message: 'Post fetched successfully',
			result
		})
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

export const PostController = {
	createPost,
	getAllPost
}
