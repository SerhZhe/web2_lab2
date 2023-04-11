class BaseModel {// eslint-disable-line no-unused-vars
  constructor(collectionName) {
    this.collectionName = collectionName
    this.fields = ['id']
  }
  /**
   * @returns {Number}
   */
  getNextId(collection) {
    let id = 1;
    const ids = collection.map(item => item.id);
    while (ids.includes(id)) {
      id++;
    }
    return id;
  }
  /**
   * @returns {Object}
   */
  GetEmpty() {
    const entry = {}

    this.fields.forEach(element => {
      entry[element] = null
    })

    return entry
  }
  /**
   * @returns {Array}
   */
  Select() {
    const stored = localStorage.getItem(this.collectionName)
    const collection = stored ? JSON.parse(stored) : []
    console.log(collection)
    return collection
  }
  Commit(collection) {
    localStorage.setItem(this.collectionName, JSON.stringify(collection))
  }
  /**
   * @param {Number} id
   * @returns {BaseModel|undefined}
   */
  FindById(id) {
    return this.Select().find(item => item.id === id)
  }
  /**
   * @param {Number} id
   * @returns {Number}
   */
  FindIndexById(id) {
    return this.Select().findIndex(item => item.id == id)
  }

  Create(row) {
    const collection = this.Select()
    const entry = this.GetEmpty()

    entry.id = this.getNextId(collection)
    for (const key in row) {
      if (entry.hasOwnProperty(key) &&
        entry.key !== 'id') {
        entry[key] = row[key]
      }
    }

    collection.push(entry)

    this.Commit(collection)

    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection })
    document.dispatchEvent(event)
  }

  Update(id, row) {
    const collection = this.Select();
    console.log(`id ${id}`)
    const index = this.FindIndexById(id);

    if (index !== -1) {
      for (const key in row) {
        if (collection[index].hasOwnProperty(key)) {
          collection[index][key] = row[key];
        }
      }

      this.Commit(collection);

      const event = new CustomEvent(`${this.collectionName}ListDataChanged`, {
        detail: collection,
      });
      document.dispatchEvent(event);
    } else {
      console.error(
        `Element with index ${index} id ${id} not found in ${this.collectionName} collection`
      );
    }
  }

  Delete(id) {
    const collection = this.Select();
    const index = this.FindIndexById(id);

    if (index !== -1) {
      collection.splice(index, 1);
      this.Commit(collection);

      // Dispatch the event to update the DataTable
      const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection });
      document.dispatchEvent(event);
    } else {
      console.error(`Element with id ${id} not found in ${this.collectionName} collection`);
    }
  }
}