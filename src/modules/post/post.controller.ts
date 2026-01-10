import type { Request, Response } from 'express'
import { PostService } from './post.service'
import type { PostStatus } from '../../../generated/prisma/enums'
import { paginationSortingHelper } from '../../helper/paginationSortingHelper'

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
		const { search, tags, status, authorId, page, limit, sortBy, sortOrder } =
			req.query
		const tagsArray = tags ? (tags as string)?.split(',') : []

		// only should to except true or false
		const isFeatured = req.query.isFeatured
			? (req.query.isFeatured as string) === 'true'
				? true
				: req.query.isFeatured === 'false'
				? false
				: undefined
			: undefined

		const options = paginationSortingHelper({
			page: page as string,
			limit: limit as string,
			sortBy: sortBy as string,
			sortOrder: sortOrder as string
		})

		const result = await PostService.getAllPostFromDb({
			search: search as string,
			tags: tagsArray,
			isFeatured: isFeatured as boolean,
			status: status as PostStatus,
			authorId: authorId as string,
			page: Number(page),
			...options
			// skip: options.skip,
			// limit: options.limit,
			// sortBy: options.sortBy,
			// sortOrder: options.sortOrder
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

const getPostById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const result = await PostService.getPostByIdFromDb(id as string)
		res.status(200).json({
			success: true,
			message: 'Post retrieved successfully',
			result
		})
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

const getPostByUserId = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const { id } = req.user
		const result = await PostService.getPostByUserIdFromDb(id as string)
		res.status(200).json({
			success: true,
			message: 'Post retrieved successfully',
			result
		})
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

const updatePost = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const { postId } = req.params
		const result = await PostService.updatePostIntoDb(
			postId as string,
			req.body,
			req.user.id
		)
		res.status(200).json({
			success: true,
			message: 'Post updated successfully',
			result
		})
	} catch (error: any) {
		res.status(500).json({
			error: error.message || 'Internal Server Error'
		})
	}
}

export const PostController = {
	createPost,
	getAllPost,
	getPostById,
	getPostByUserId,
	updatePost
}
