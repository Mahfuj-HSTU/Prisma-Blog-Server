import express from 'express'
import { PostController } from './post.controller'
import { UserRole, verifyAuth } from '../../middlewares/auth'
const router = express.Router()

router.post('/', verifyAuth(UserRole.USER), PostController.createPost)

export const postRouter = router
