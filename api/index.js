import express from 'express';
import userRouter from './routers/users.js'
import commentRouter from './routers/comments.js'
import likeRouter from './routers/likes.js'
import postRouter from './routers/posts.js'
import authRouter from './routers/auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'

const app = express()

//upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })

//middle ware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
}))
app.use(cookieParser())
//router
app.use('/api/users', userRouter)
app.use('/api/comments', commentRouter)
app.use('/api/likes', likeRouter)
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file
  res.status(200).json(file.filename)
})

app.listen(8088, () => {
  console.log('Server running on port 8088')
})

