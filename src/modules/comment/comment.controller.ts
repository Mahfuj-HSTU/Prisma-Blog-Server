import type { Request, Response } from 'express'
import { CommentService } from './comment.service'

const createComment = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		req.body.authorId = req.user.id
		const result = await CommentService.createCommentIntoDb(req.body)
		res.status(201).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

const getCommentById = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const { commentId } = req.params
		const result = await CommentService.getCommentByIdFromDb(
			commentId as string
		)
		if (!result) {
			return res.status(404).json({ error: 'Comment not found' })
		}
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

const getCommentsByAuthor = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const { authorId } = req.params
		const result = await CommentService.getCommentsByAuthorIdFromDb(
			authorId as string
		)
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

const deleteComment = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const { commentId } = req.params
		const result = await CommentService.deleteCommentFromDb(
			commentId as string,
			req.user.id as string
		)
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}
const updateComment = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const { commentId } = req.params
		const result = await CommentService.updateCommentIntoDb(
			commentId as string,
			req.body,
			req.user.id as string
		)
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

export const CommentController = {
	createComment,
	getCommentById,
	getCommentsByAuthor,
	deleteComment,
	updateComment
}
