import { db } from "../config/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
  //query if the user exists
  const q = 'SELECT * FROM users WHERE username = ?'

  db.query(q, [req.body.username], (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: err })
    }
    if (result.length > 0) {
      return res.status(409).json({ error: 'User already exists' })
    }
    //if not, create a new user
    const q = 'INSERT INTO users (username,email,name,password) VALUES (?)'

    //hash the password
    const salt = bcrypt.genSaltSync(10)
    const { username, email, name, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, salt)
    //query params
    const params = [username, email, name, hashedPassword]
    db.query(q, [params], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: err })
      }
      res.status(200).json({ message: 'User created' })
    })
  })
}

export const login = (req, res) => {
  //TODO:login
  const q = 'SELECT * FROM users WHERE username = ?'
  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json({ error: err })
    if (result.length === 0) return res.status(401).json({ error: 'User not found' })
    //check the password
    const checkPassword = bcrypt.compareSync(req.body.password, result[0].password)
    if (!checkPassword) return res.status(400).json({ error: 'Wrong password or username' })
    const token = jwt.sign({ id: result[0].id }, 'screteKey')

    const { password, ...other } = result[0]

    res.cookie('acceptToken', token,
      { httpOnly: true }).status(200).json(other)
  })
}

export const logout = (req, res) => {
  //TODO:logout
  res.clearCookie('acceptToken', {
    secure: true,
    sameSite: 'none'
  }).status(200).json({ message: 'Logout successfully' })
}
