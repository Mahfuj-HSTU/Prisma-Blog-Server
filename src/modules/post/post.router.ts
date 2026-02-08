import express from 'express'
import { PostController } from './post.controller'
import { UserRole, verifyAuth } from '../../middlewares/auth'
const router = express.Router()

router
	.get('/', PostController.getAllPost)
	.get('/stats', verifyAuth(UserRole.ADMIN), PostController.getStats)
	.post(
		'/',
		verifyAuth(UserRole.USER, UserRole.ADMIN),
		PostController.createPost
	)
	.get('/my-posts', verifyAuth(UserRole.USER), PostController.getPostByUserId)
	.get('/:id', PostController.getPostById)
	.patch(
		'/:postId',
		verifyAuth(UserRole.USER, UserRole.ADMIN),
		PostController.updatePost
	)
	.delete(
		'/:postId',
		verifyAuth(UserRole.USER, UserRole.ADMIN),
		PostController.deletePost
	)

export const postRouter = router
