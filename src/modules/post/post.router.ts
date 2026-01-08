import express from 'express'
import { PostController } from './post.controller'
import { UserRole, verifyAuth } from '../../middlewares/auth'
const router = express.Router()

router
	.post('/', verifyAuth(UserRole.USER), PostController.createPost)
	.get('/', PostController.getAllPost)
	.get('/my-posts', verifyAuth(UserRole.USER), PostController.getPostByUserId)
	.get('/:id', PostController.getPostById)

export const postRouter = router
