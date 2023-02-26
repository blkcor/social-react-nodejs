import { db } from "../config/db.js"
import jwt from 'jsonwebtoken'

export const getRelationships = (req, res) => {
  const token = req.cookies.acceptToken;
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json('Invalid token!')
    const q = 'SELECT r.followerUserId from relationships as r WHERE followedUserId = ?'
    db.query(q, [req.query.followedUserId], (err, result) => {
      if (err) return res.status(500).json(err)
      result = result.map(relationship => relationship.followerUserId)
      return res.status(200).json(result)
    })
  })
}

export const addRelationship = (req, res) => {
  const token = req.cookies.acceptToken;
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json('Invalid token!')
    const q = 'INSERT INTO relationships(`followerUserId`,`followedUserId`) VALUES (?)';
    const params = [
      userInfo.id,
      req.body.followedUserId
    ]
    db.query(q, [params], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json('following!')
    })
  })
}


export const deleteRelationship = (req, res) => {
  const token = req.cookies.acceptToken;
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json('Invalid token!')
    const q = 'DELETE FROM relationships WHERE followedUserId = ? AND followerUserId = ?'
    db.query(q, [req.query.followedUserId, userInfo.id], (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json('cancel to follow successfully!')
    })
  })

}
