import { db } from "../config/db.js"
import jwt from 'jsonwebtoken'
export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes as l where l.postId = ?"
  db.query(q, [req.query.postId], (err, result) => {
    if (err) return res.status(500).json(err)
    return res.status(200).json(result.map(like => like.userId))
  })
}
export const addLike = (req, res) => {
  const token = req.cookies.acceptToken
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token")
    const q = "INSERT INTO likes(`userId`,`postId`) VALUES (?)"
    const params = [
      userInfo.id,
      req.body.postId
    ]
    db.query(q, [params], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}

export const deleteLike = (req, res) => {
  const token = req.cookies.acceptToken
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token")
    const q = "DELETE FROM likes WHERE userId = ? AND postId = ?"
    db.query(q, [userInfo.id, req.query.postId], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}
