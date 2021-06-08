import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import generateToken from '../util/generateToken.js'

export const loginController = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: 'User Not Found' })
  }
  const isUser = await bcrypt.compare(password, user.password)
  if (!isUser) {
    return res.status(401).json({ message: 'Wrong Credentials' })
  }

  const token = generateToken(user.id)

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: token,
  })
}

export const registerController = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    return res.status(401).json({ message: 'User already exists' })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  User.create(
    {
      name,
      email,
      password: hashedPassword,
    },
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: `${err}` })
      }
      if (user) {
        const token = generateToken(user._id)
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: token,
        })
      } else {
        return res.status(400).json({ message: 'Invalid user data' })
      }
    }
  )
}
