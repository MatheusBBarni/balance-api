const kAccountService = Symbol.for('AccountService')

export class AccountController { 
  constructor({ accountService }) {
    console.log(accountService);
    this[kAccountService] = accountService
  }

  balance(req, reply) {
    const { account_id: accountId } = req.query
    const balance = this[kAccountService].getBalance(accountId)

    reply
      .code(balance > 0 ? 200 : 404)
      .send(balance)
  }

  event(req, reply) {
    reply.send({ hello: 'World' })
  }

  reset(_, reply) {
    this[kAccountService].resetState()
    reply.code(200).send("OK")
  }
}