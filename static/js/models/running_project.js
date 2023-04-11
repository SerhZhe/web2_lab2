class RunningProject extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('running_projects')
      this.fields = this.fields.concat(['project', 'executor', 'start_time', 'end_time'])
    }
  }