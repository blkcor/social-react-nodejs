import express from 'express';
import userRouter from './routers/users.js'
import commentRouter from './routers/comments.js'
import likeRouter from './routers/likes.js'
import postRouter from './routers/posts.js'
import authRouter from './routers/auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
//middle ware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//router
app.use('/api/users', userRouter)
app.use('/api/comments', commentRouter)
app.use('/api/likes', likeRouter)
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

