var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for date_of_birth as year only
AuthorSchema
.virtual('yob')
.get(function () {
  return moment(this.date_of_birth).format('YYYY');
});

// Virtual for date_of_death as year only
AuthorSchema
.virtual('yod')
.get(function () {
  console.log("this.date_of_death="+this.date_of_death);
  if (this.date_of_death) {
    return moment(this.date_of_death).format('YYYY');
  } else {
    return "present";
  }
});


// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  if (this.date_of_death && this.date_of_birth) {
    return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
  } else if (!this.date_of_death) {
    console.log("!this.date_of_death");
    var dt = new Date();
    var this_year = 1900+dt.getYear()
    return (this_year - (1900+this.date_of_birth.getYear())).toString();
  }
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
