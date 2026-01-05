import express from 'express'
import { CommentController } from './comment.controller'
import { UserRole, verifyAuth } from '../../middlewares/auth'
const router = express.Router()

router.post(
	'/',
	verifyAuth(UserRole.USER, UserRole.ADMIN),
	CommentController.createComment
)

export const commentRouter = router
