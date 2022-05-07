const kAccounts = Symbol.for('accounts')

export default class AccountRepository {
  constructor() {
    this[kAccounts] = new Map()
  }

  create({ id, balance }) {
    this[kAccounts].set(id, { id, balance })
    return this.get(id)
  }

  get(accountId) {
    return this[kAccounts].get(accountId)
  }

  update({ id, balance }) {
    const account = this.get(id)

    if (account) {
      this[kAccounts].set(id, { id, balance })
      return this.get(id)
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