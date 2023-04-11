class Customer extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('customers')
      this.fields = this.fields.concat(['name', 'budget'])
    }
  }