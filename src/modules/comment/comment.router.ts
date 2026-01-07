import express from 'express'
import { CommentController } from './comment.controller'
import { UserRole, verifyAuth } from '../../middlewares/auth'
const router = express.Router()

router.post(
	'/',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.createComment
)
router.get(
	'/:commentId',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.getCommentById
)
router.get(
	'/author/:authorId',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.getCommentsByAuthor
)
router.delete(
	'/:commentId',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.deleteComment
)
export const commentRouter = router
