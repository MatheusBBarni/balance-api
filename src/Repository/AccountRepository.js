const kAccounts = Symbol.for('accounts')

export class AccountRepository {
  constructor() {
    this[kAccounts] = new Map()
  }

  create({ id, balance }) {
    this[kAccounts].set(id, { id, balance })
  }

  get(accountId) {
    return this[kAccounts].get(accountId)
  }

  update({ id, balance }) {
    const account = this.getAccount(id)

    if (account) {
      return this[kAccounts].set(id, { id, balance })
    }

    return null
  }

  delete({ id }) {
    return this[kAccounts].delete(id)
  }

  reset() {
    this[kAccounts] = new Map()
  }
}