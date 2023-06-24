class BaseModel {// eslint-disable-line no-unused-vars
  constructor (collectionName) {
    this.collectionName = collectionName
    this.fields = ['id']
  }
  /**
   * @returns {Number}
   */
  getNextId (collection) {
    const ids = collection.map(item => item.id);

    for (let i = 1; i <= ids.length; i++) {
      if (!ids.includes(i)) {
        return i;
      }
    }
  
    return ids.length + 1;
  
  }
  /**
   * @returns {Object}
   */
  GetEmpty () {
    const entry = {}

    this.fields.forEach(element => {
      entry[element] = null
    })

    return entry
  }
  /**
   * @returns {Array}
   */
  Select () {
    const stored = localStorage.getItem(this.collectionName)
    const collection = stored ? JSON.parse(stored) : []

    return collection
  }
  Commit (collection) {
    localStorage.setItem(this.collectionName, JSON.stringify(collection))
  }
  /**
   * @param {Number} id
   * @returns {BaseModel|undefined}
   */
  FindById (id) {
    return this.Select().find(item => item.id === id)
  }
  /**
   * @param {Number} id
   * @returns {Number}
   */
  FindIndexById (id) {
    return this.Select().findIndex(item => item.id === id)
  }
  /*Create(row) {
    const collection = this.Select();
    const entry = this.GetEmpty();
  
    entry.id = this.getNextId(collection);
    for (const key in row) {
      if (entry.hasOwnProperty(key) &&
          entry.key !== 'id') {
        entry[key] = row[key];
      }
    }
  
    collection.push(entry);
  
    this.Commit(collection);
  
    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection });
    document.dispatchEvent(event);
}*/


  /**
   * @param {Number} id
   */
  Delete (id) {
    const collection = this.Select()
    const index = this.FindIndexById(id)

    if (index >= 0) {
      collection.splice(index, 1)
      this.Commit(collection)

      const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection })
      document.dispatchEvent(event)
    } else {
    console.error(`No ${this.collectionName} entry found with id ${id}.`)
    }
  }

  Update(id, updatedData) {
    const collection = this.Select();
    const index = this.FindIndexById(id);
    
    if (index >= 0) {
      const oldData = collection[index];
      const newData = {...oldData, ...updatedData};
      
      collection[index] = newData;
      this.Commit(collection);
      const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection });
      document.dispatchEvent(event);
    } else {
      console.error(`No ${this.collectionName} entry found with id ${id}.`);
    }
  }

}