import type { Request, Response } from 'express'
import { PostService } from './post.service'
import type { PostStatus } from '../../../generated/prisma/enums'

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
		const { search, tags, status } = req.query
		const tagsArray = tags ? (tags as string)?.split(',') : []

		// only should to except true or false
		const isFeatured = req.query.isFeatured
			? (req.query.isFeatured as string) === 'true'
				? true
				: req.query.isFeatured === 'false'
				? false
				: undefined
			: undefined

		const result = await PostService.getAllPostFromDb({
			search: search as string,
			tags: tagsArray,
			isFeatured: isFeatured as boolean,
			status: status as PostStatus
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
