import { db } from '../config/db.js'
import jwt from 'jsonwebtoken'
export const getUser = (req, res) => {
  //TODO: find a user from the db
  const q = 'SELECT * FROM users WHERE id = ?'
  db.query(q, [req.params.userId], (err, result) => {
    if (err) return res.status(500).json(err)
    const { password, ...info } = result[0]
    return res.status(200).json(info)
  })
}

export const updateUser = (req, res) => {
  const token = req.cookies.acceptToken
  if (!token) return res.status(401).json('Not logged in!')
  jwt.verify(token, "CHY", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";
    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        localStorage.setItem('user', data)
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

