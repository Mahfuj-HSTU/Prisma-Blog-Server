import express from 'express'
import { CommentController } from './comment.controller'
import { UserRole, verifyAuth } from '../../middlewares/auth'
const router = express.Router()

router.post(
	'/',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.createComment
)
router
	.get(
		'/:commentId',
		verifyAuth(UserRole.USER, UserRole.ADMIN),
		CommentController.getCommentById
	)
	.delete(
		'/:commentId',
		verifyAuth(UserRole.USER, UserRole.ADMIN),
		CommentController.deleteComment
	)
	.patch(
		'/:commentId',
		verifyAuth(UserRole.USER, UserRole.ADMIN),
		CommentController.updateComment
	)

router.get(
	'/author/:authorId',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.getCommentsByAuthor
)

export const commentRouter = router
