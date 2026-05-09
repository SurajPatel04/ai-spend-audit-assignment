import { Router } from 'express'
import { createAudit, getAudit } from '../controllers/audit.controller.js'

const router = Router()

router.post('/', createAudit)
router.get('/:auditId', getAudit)

export default router