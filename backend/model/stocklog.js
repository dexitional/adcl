var db = require('../config/database');
var Schema = db.Schema;

module.exports = db.model('StockLog', Schema({
  _id:  { type: Schema.Types.ObjectId, auto: true},
  meta: { type: Object },
  user: { type: String },
  created_at: { type: Date, default: new Date()},
  siteid : { type: Number, default: 1 },
}));


/*
  ACTION TYPES
  - LOGIN_SUCCESS
  - LOGIN_FAILED
  - PRODUCT_CREATED
  - PRODUCT_UPDATED
  - PRODUCT_DELETED
  - STOCK_ADDED
  - STOCK_LOADED
  - STOCK_EDITTED
  - STOCK_DELETED
  - SALE_CREATED
  - SALE_UPDATED
  - ITEM_REDUCED
  - ITEM_INCREASED
  - PRICE_UPDATED
*/