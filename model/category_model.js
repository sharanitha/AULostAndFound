//This is used to connect to the Category Table
//get a list of categories
//add a category 
//delete a category
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../util/common.utils');
const { setmultipleColumnSet } = require('../util/uncommon.utils');

class CategoryModel {
    tableName = 'category';

    create = async (category_name ) => {
        
        const sql = `INSERT INTO ${this.tableName}
        ( category_name ) VALUES (?)`;

        return await query(sql, [category_name]);
    }

    findAll = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        //sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

}

module.exports = new CategoryModel;