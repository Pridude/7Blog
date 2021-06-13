import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const isAuth = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuth: false })
    } else {
      const user = await User.findOne(decoded._id)
      if (user) {
        return res.status(201).json({ isAuth: true })
      } else {
        return res.status(401).json({ isAuth: false })
      }
    }
  })
}
//  else {

// }

// res.status(500).json({isAuth: false, message:"An error Occured"})
