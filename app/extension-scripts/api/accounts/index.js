import ObsStore from '../../lib/ob-store'

export default class Accounts {
  constructor ({ getTransactionHistory, balances, accountsMetaData }) {
    this.balances = balances
    this.getTransactionHistory = getTransactionHistory
    this.store =  new ObsStore({ accountsMetaData })
  }


  getApi () {
    return {
      getAccounts: this.getAccounts.bind(this),
      putAccounts: this.updateAccount.bind(this),
      putSelctedAccount: this.setSelctedAccount.bind(this),
      getSelctedAccount: this.getSelctedAccount.bind(this),
    }
  }

  async getAccounts({ address }) {
    if (address) return this.getAccount(address)
    return this._getAccounts()
  }

  async _getAccounts (address) {
    return this.store.getState().accountsMetaData
  }

  getAccountMetaDate(address) {
    return this.store.getState().accountsMetaData
    .find(account => account.address === address)
  }

  async _getAccount (address) {
    account = this.getAccountMetaDate(address)
    const balances = await this.balances.get(address)
    const fiatTotal = balances.reduce((fiatTotal, tokenBalance) => {
      return fiatTotal + ParseFloat(tokenBalance.fiatBalance)
    }, 0)
    const activity = await this.getTransactionHistory(address)
    return {
      ...account,
      tokens: balances,
      total_balance: {
        amount: fiatTotal,
        currency: this.userPrefernces.getState().fiatDisplay
      }
    }

  }

  updateAccount (newAccountData) {
    let found
    const accountsMetaData = this.store.getState().accountsMetaData.map((account) => {
      if (account.address === newAccountData.address ) {
        found = true
        return { ...account, ...newAccountData}
      }
      return account
    })
    this.store.putState({ accountsMetaData })
  }

  setSelctedAccount ({ address }) {
    this.selctedAccount = this.getAccount(address)
  }

  getSelctedAccount () {
    return this.selctedAccount
  }
}