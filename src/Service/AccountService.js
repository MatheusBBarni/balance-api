const kAccountRepository = Symbol.for('AccountRepository')
const kDeposit = Symbol.for('deposit')
const kTransfer = Symbol.for('transfer')
const kWithdraw = Symbol.for('withdraw')

const ACTION_TYPES = {
  'deposit': kDeposit,
  'withdraw': kWithdraw,
  'transfer': kTransfer
}

export default class AccountService {
  constructor({ accountRepository }) {
    this[kAccountRepository] = accountRepository
  }

  getBalance(accountId) {
    if (this[kAccountRepository].get(accountId)) {
      return this[kAccountRepository].get(accountId).balance
    }

    return 0
  }

  [kDeposit]({ destination, amount }) {
    let account = this[kAccountRepository].get(destination)
    if (!account) {
      account = this[kAccountRepository].create({ id: destination, balance: amount })
    } else {
      account = this[kAccountRepository].update({ id: destination, balance: account.balance + amount })
    }

    return {
      response: {
        destination: {
          id: destination,
          balance: account.balance
        }
      },
      status: 201
    }
  }

  [kWithdraw]({ origin, amount }) {
    let account = this[kAccountRepository].get(origin)

    if (!account) {
      return {
        response: 0,
        status: 404
      }
    }

    const newBalance = account.balance - amount

    account = this[kAccountRepository].update({ id: origin, balance: newBalance < 0 ? account.balance : newBalance })

    return {
      response: {
        origin: {
          id: origin,
          balance: account.balance
        }
      },
      status: 201
    }
  }

  [kTransfer]({ origin, amount, destination }) {
    let originAccount = this[kAccountRepository].get(origin)
    let destinationAccount = this[kAccountRepository].get(destination)

    if (!originAccount) {
      return {
        response: 0,
        status: 404
      }
    }

    if (!destinationAccount) {
      destinationAccount = this[kAccountRepository].create({ id: destination, balance: 0 })
    }

    const newOriginBalance = originAccount.balance - amount

    if (newOriginBalance < 0) {
      return {
        response: 0,
        status: 403
      }
    }

    originAccount = this[kAccountRepository].update({ id: origin, balance: newOriginBalance })
    destinationAccount = this[kAccountRepository].update({ id: destination, balance: destinationAccount.balance + amount })

    return {
      response: {
        origin: {
          id: origin,
          balance: originAccount.balance
        },
        destination: {
          id: destination,
          balance: destinationAccount.balance
        }
      },
      status: 201
    }
  }

  action({ body }) {
    const { type } = body

    return this[ACTION_TYPES[type]](body)
  }

  resetState() {
    this[kAccountRepository].reset()
  }
}