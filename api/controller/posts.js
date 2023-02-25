import { db } from '../config/db.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'
export const getPosts = (req, res) => {
  const token = req.cookies.acceptToken
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json('Invalid token')
    //token is valid
    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY createAt DESC`
    db.query(q, [userInfo.id, userInfo.id], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}

export const addPost = (req, res) => {
  const token = req.cookies.acceptToken
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json('Invalid token')
    //token is valid
    const q = "INSERT INTO posts(`desc`,`img`,`createAt`,`userId`) VALUES (?)"

    const params = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id
    ]
    db.query(q, [params], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}
