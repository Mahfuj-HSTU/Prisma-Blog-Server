import type { Request, Response } from 'express'
import { CommentService } from './comment.service'

const createComment = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const result = await CommentService.createCommentIntoDb(req.body)
		res.status(201).json(result)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error', details: error })
	}
}

export const CommentController = {
	createComment
}
