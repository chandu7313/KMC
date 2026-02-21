import express from 'express'
import { getUserData, updateLanguage, updatePreferences } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)
userRouter.post('/update-language', userAuth, updateLanguage)
userRouter.post('/preferences', userAuth, updatePreferences)

export default userRouter