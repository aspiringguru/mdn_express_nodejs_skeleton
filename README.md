# node express mongoose CRUD demo

a CRUD demo using node express mongoose with mongo

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### git repo and source

This demo is borrowed from https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website

This git repo is available at https://github.com/aspiringguru/mdn_express_nodejs_skeleton.git

based on the original repo https://github.com/hamishwillee/express-locallibrary-tutorial

### git commit notes

staged commits to match each page of the mdn tutorial

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website

### Designing Schema

![alt text](readme_files/uml_diagram.png "UML diagram")

### Designing Schema

populate the database with data

npm install --save mongoose
node populatedb mongodb://127.0.0.1/my_database

to verify contents of database after the populatedb.js script.

mongo
#to list databases
show dbs
#switch to the database
use my_database
#list 'tables'
show collections
#list contents of collections
db.authors.find()
db.bookinstances.find()
db.books.find()
db.genreinstances.find()
