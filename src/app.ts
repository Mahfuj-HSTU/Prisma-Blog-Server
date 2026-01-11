import express from 'express'
import { postRouter } from './modules/post/post.router'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth'
import cors from 'cors'
import { commentRouter } from './modules/comment/comment.router'
import errorHandler from './middlewares/globalErrorHandler'
import notFoundMiddleware from './middlewares/notFount'

const app = express()
app.all('/api/auth/{*any}', toNodeHandler(auth))

app.use(express.json())
app.use(
  cors({
    origin: process.env.APP_URL!,
    credentials: true
  })
)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)

app.get('/', (req, res) => {
  res.send('Hello, World!')
})
app.use(notFoundMiddleware)
app.use(errorHandler)

export default app
