import Fastify from 'fastify'

import AccountRepository from './Repository/AccountRepository.js'
import AccountService from './Service/AccountService.js'

const fastify = Fastify({ logger: true })

const PORT = process.env.PORT || 3000

const accountRepository = new AccountRepository()
const accountService = new AccountService({ accountRepository })

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    var json = JSON.parse(body)
    done(null, json)
  } catch (err) {
    done(null, json)
  }
})


fastify.post('/reset', (_, reply) => {
  accountService.resetState()
  reply.code(200).send("OK")
})

fastify.post('/event', (req, reply) => {
  const { body } = req
  const result = accountService.action({ body })

  reply
    .code(result.status)
    .send(result.response)
})

fastify.get('/balance',  (req, reply) => {
  const { account_id: accountId } = req.query
  const balance = accountService.getBalance(accountId)

  reply
    .code(balance > 0 ? 200 : 404)
    .send(balance)
})

const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
