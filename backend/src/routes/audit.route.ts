import { Router } from 'express'
import { createAudit, getAudit } from '../controllers/audit.controller.js'
import { moderateLimiter, looseLimiter } from '../middlewares/rateLimiter.js'

const router = Router()

router.post('/', moderateLimiter, createAudit)
router.get('/:auditId', looseLimiter, getAudit)

export default router