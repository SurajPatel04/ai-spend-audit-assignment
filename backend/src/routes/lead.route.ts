import { Router } from 'express'
import { createLead } from '../controllers/lead.controller.js'

const router = Router()

router.post('/', createLead)

export default router