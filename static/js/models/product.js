class Product extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('products')
      this.fields = this.fields.concat(['code','name','country'])
    }
  }
  