var mongoose = require('mongoose');
var moment = require('moment');
//https://momentjs.com/docs/
//Moment was designed to work both in the browser and in Node.js.


var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
//updated in Date_formatting_using_moment
BookInstanceSchema
.virtual('due_back_formatted')
.get(function () {
  //return '/catalog/bookinstance/' + this._id;
  return moment(this.due_back).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
