class ProductStock extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('productStocks')
      this.fields = this.fields.concat(['stock', 'product'])
    }
  }
