import { db } from '../config/db.js'
export const getUser = (req, res) => {
  //TODO: find a user from the db
  const q = 'SELECT * FROM users WHERE id = ?'
  db.query(q, [req.params.userId], (err, result) => {
    if (err) return res.status(500).json(err)
    const { password, ...info } = result[0]
    return res.status(200).json(info)
  })
}
