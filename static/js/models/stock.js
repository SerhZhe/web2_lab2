class Stock extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('stocks')
      this.fields = this.fields.concat(['number','shop', 'capacity'])
    }
  }
