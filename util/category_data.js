class categoryData {
    #name = '';

    constructor(name) {
        this.#name = name;
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

module.exports = categoryData
