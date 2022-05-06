import Fastify from 'fastify'

import { AccountController } from './Controller/AccountController.js'
import { AccountService } from './Service/AccountService.js'
import { AccountRepository } from './Repository/AccountRepository.js'

const fastify = Fastify({ logger: true })

const accountRepository = new AccountRepository()
const accountService = new AccountService({ accountRepository })
const accountController = new AccountController({ accountService })
console.log(accountController);

const PORT = process.env.PORT || 3000

fastify.post('/reset', accountController.reset)
fastify.post('/event', accountController.event)
fastify.get('/balance', accountController.balance)

const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
