import { db } from "../config/db.js"
import jwt from 'jsonwebtoken'
import moment from 'moment'
export const getComments = (req, res) => {
  const q = `SELECT c.*,u.id as userId,name,profilePic from users as u JOIN comments as c on (u.id = c.userId)
              WHERE c.postId = ? ORDER BY c.createAt DESC`
  db.query(q, [req.query.postId], (err, result) => {
    if (err) return res.status(500).json(err)
    return res.status(200).json(result)
  })
}

export const addComment = (req, res) => {
  const token = req.cookies.acceptToken
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token")
    const q = "INSERT INTO comments(`desc`,`userId`,`postId`,`createAt`) VALUES (?)"
    const params = [
      req.body.desc,
      userInfo.id,
      req.body.postId,
      moment(Date.now()).format('YYYY-MM-DD HH-mm-ss')
    ]
    db.query(q, [params], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}


