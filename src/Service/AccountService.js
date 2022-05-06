const kAccountRepository = Symbol.for('AccountRepository')

export class AccountService {
  constructor({ accountRepository }) {
    this[kAccountRepository] = accountRepository
  }

  getBalance(accountId) {
    const account = this[kAccountRepository].get(accountId)

    return account ? account.balance : 0
  }

  resetState() {
    this[kAccountRepository].reset()
  }
}