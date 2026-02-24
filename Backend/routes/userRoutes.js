import express from 'express'
import { getUserData, updateLanguage, updatePreferences, saveAddress } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)
userRouter.post('/update-language', userAuth, updateLanguage)
userRouter.post('/update-preferences', userAuth, updatePreferences)
userRouter.post('/save-address', userAuth, saveAddress)

export default userRouter