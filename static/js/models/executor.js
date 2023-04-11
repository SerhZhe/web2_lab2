class Executor extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('executors')
      this.fields = this.fields.concat(['name', 'exp', 'workers'])
    }
  }