var mongoose = require('mongoose');

var CourtSchema = mongoose.Schema({
  name: { type: String },
  location: { type: String },
  longitude: { type: String },
  latitude: { type: String }
})

var Court = mongoose.model('Court', CourtSchema);
module.exports = Court;
