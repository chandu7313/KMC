import express from 'express'
import { submitSurvey, getSurveyStatus } from '../controllers/surveyController.js'
import userAuth from '../middleware/userAuth.js'

const surveyRouter = express.Router()

surveyRouter.post('/submit', userAuth, submitSurvey)
surveyRouter.get('/status', userAuth, getSurveyStatus)

export default surveyRouter
