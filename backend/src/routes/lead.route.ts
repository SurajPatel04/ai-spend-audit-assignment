import { Router } from 'express'
import { createLead } from '../controllers/lead.controller.js'
import { moderateLimiter } from '../middlewares/rateLimiter.js'

const router = Router()

router.post('/', moderateLimiter, createLead)

export default router