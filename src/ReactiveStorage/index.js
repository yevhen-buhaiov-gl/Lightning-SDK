import { default as Storage } from '../Storage'
import localCookie from 'localCookie/src/localCookie.js'

export class ReactiveStorage {
  constructor(namespace, defaultData = []) {
    if (!namespace || typeof namespace !== 'string' || namespace === '') {
      throw new Error('Namespace must be non-empty string')
    }
    this._namespace = namespace
    this._data = {}
    if (Array.isArray(defaultData) && defaultData.length) {
      this.setItems(defaultData)
    } else {
      console.error(`${namespace}: defaultData isn't array`)
    }
    this._acitonOnUpdate = {}
    this._localCookie = new localCookie()
  }

  /**
   * Get propery name with namespace
   * @param {String} prop
   * @returns Property name with namespace
   */
  getPropWithNamespace(prop) {
    return [this._namespace, prop].join('.')
  }

  removeNamespaceOfProperty(prop) {
    return prop.replace([this._namespace, ''], '')
  }

  /**
   * Run all actions that attached to propery
   * @param {String} prop Property name
   * @param {any} oldValue Old value of the property
   * @param {*} newValue New value of the property
   */
  runActions(prop, oldValue, newValue) {
    const key = this.getPropWithNamespace(prop)
    const actionsQueue = []
    if (this._acitonOnUpdate && this._acitonOnUpdate[key] && this._acitonOnUpdate[key].length) {
      this._acitonOnUpdate[key].forEach(action => actionsQueue.push(action))
    }
    const filteredActionsQueue = actionsQueue.filter(
      (value, index) => actionsQueue.indexOf(value) === index
    )
    filteredActionsQueue.forEach(action => action(prop, oldValue, newValue))
  }

  /**
   * Add namespace to propery and get data from _data object
   * @param {String} prop Property name
   * @returns Property with namespace
   */
  getData(prop) {
    return this._data[this.getPropWithNamespace(prop)]
  }

  /**
   * Set data by property name to _data object (adds namespace to property)
   * @param {String} prop Property name
   * @param {any} value Data that we can store in _data object by property
   * @param {boolean} runActions Indicates do we need to run all attached actions to the propery or not
   */
  setData(prop, value, runActions) {
    const propWithPrefix = this.getPropWithNamespace(prop)
    const oldValue = this._data[propWithPrefix]
    this._data[propWithPrefix] = value
    if (runActions) {
      this.runActions(prop, oldValue, value)
    }
  }

  /**
   * Get data by propery name
   * @param {String} prop
   * @returns Data that added to _data object by property
   */
  get(prop) {
    return this.getData(prop)
  }

  /**
   * Get clone of _data object without properies namespaces
   * @returns Data object
   */
  getAll() {
    const data = {}
    for (const prop in this._data) {
      data[this.removeNamespaceOfProperty(prop)] = this._data[prop]
    }
    return data
  }

  /**
   * Set data by property
   * @param {String} prop Property name
   * @param {any} value Property data
   * @param {*} external Indicates do we need to store this data in local or cookie storage
   * @param {*} runActions ndicates do we need to run all attached actions to the propery or not
   */
  set(prop, value, external = false, runActions = true) {
    if (external) {
      Storage.set(this.getPropWithNamespace(prop), value)
      this.set(prop, value, false, runActions)
    } else {
      this.setData(prop, value, runActions)
    }
  }

  /**
   * Set array of data
   * @param {Object} data Data object
   */
  setItems(data) {
    data.forEach(({ prop, value, external }) => {
      this.set(prop, value, external)
    })
  }

  /**
   * Sync local or cookie storage to the _data object
   */
  syncData() {
    this._localCookie
      .keys()
      .map(key => ({ key, value: Storage.get(key) }))
      .forEach(({ key, value }) => {
        if (key.indexOf(this._namespace) !== -1) {
          const prop = this.removeNamespaceOfProperty(key)
          this.set(prop, value)
        }
      })
  }

  /**
   * Set action or array of actions to the propery or properties array
   * @param {String|String[]} prop
   * @param {Function|Function[]} action
   */
  setActions(prop, action) {
    if (Array.isArray(prop)) {
      prop.forEach(k => {
        const keyWithPrefix = this.getPropWithNamespace(k)
        this.addAction(keyWithPrefix, action)
      })
    } else {
      const keyWithPrefix = this.getPropWithNamespace(prop)
      this.addAction(keyWithPrefix, action)
    }
  }

  /**
   * Add actions to _actionOnUpdate object by property name
   * @param {String} prop
   * @param {Function|Function[]} action
   */
  addAction(prop, action) {
    if (this._acitonOnUpdate[prop]) {
      if (Array.isArray(action)) {
        this._acitonOnUpdate[prop].push(...action)
      } else {
        this._acitonOnUpdate[prop].push(action)
      }
    } else {
      this._acitonOnUpdate[prop] = Array.isArray(action) ? [...action] : [action]
    }
  }
}
export default ReactiveStorage
