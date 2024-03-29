# node express mongoose CRUD demo

a CRUD demo using node express mongoose with mongo

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

#to identify ubuntu version
lsb_release -a

# clone
clone this git repo, starting with the first commit (will update the commit to branch)
git clone https://github.com/aspiringguru/mdn_express_nodejs_skeleton.git

#setup mongo
this is my preferred guide, YMMV.
https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
sudo apt update
sudo apt install -y mongodb
#check status of installed server
sudo systemctl status mongodb
sudo systemctl stop mongodb
sudo systemctl start mongodb
sudo systemctl restart mongodb
sudo systemctl disable mongodb #disable autostart
sudo systemctl enable mongodb  #re-enable autostart
#check firewall status. default port for mongo is 27017  
nbb: should not need to allow connection to mongodb from other than localhost
as this system config will connect from nodejs server on same machine
#mongo config file
```
sudo nano /etc/mongodb.conf
sudo systemctl restart mongodb
```
restart mongodb after editing config
```
mongod -v  
```
This will return :
```
Data directory /data/db not found
```
on a fresh install. use mongo instead.

# use mongo instead
```
mongo --version
```
#for demo purposes, connect to a database using this format
```
mongo localhost:27017/dbname  #using this format to connect to admin database
mongo localhost:27017/admin
show collections
db.system.version.find()
```

other mongo diagnostics - from bash
```
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```
will return
```
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.3
{
        "authInfo" : {
                "authenticatedUsers" : [ ],
                "authenticatedUserRoles" : [ ]
        },
        "ok" : 1
}
```

Other useful mongo commands
connect to server
```
mongo
```
list available databases
```
show dbs
```
on a freshly install this will show admin and local
# install node (refer other guides) nb: needs LTS
```
node -v  #should return v10.16.3 or later
npm -v   #should return  6.11.3  or later
```

#now run setup script

#starting mongodb server in ubuntu on windows.
sudo /etc/init.d/mongodb start
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
#start the node server
set dev mode to enable more verbose err messages

DEBUG=express-locallibrary-tutorial:*
npm run devstart



### git repo and source

This demo is borrowed from https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website

This git repo is available at https://github.com/aspiringguru/mdn_express_nodejs_skeleton.git

based on the original repo
https://github.com/mdn/express-locallibrary-tutorial
also refer this   https://github.com/hamishwillee/express-locallibrary-tutorial

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

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
DEBUG=express-locallibrary-tutorial:*
npm run devstart

http://localhost:3000/
http://localhost:3000/catalog
http://localhost:3000/catalog/books
http://localhost:3000/catalog/bookinstances/
http://localhost:3000/catalog/authors/
http://localhost:3000/catalog/genres/
#get id for book from mongodb
http://localhost:3000/catalog/book/5846437593935e2f8c2aa226
http://localhost:3000/catalog/book/create


### Chapter 5 - Asynchronous flow control using async
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/flow_control_using_async
understand series/paralell/waterfall
https://stackoverflow.com/questions/17853105/difference-between-async-series-and-async-parallel
https://stackoverflow.com/questions/9258603/what-is-the-difference-between-async-waterfall-and-async-series
https://medium.com/velotio-perspectives/understanding-node-js-async-flows-parallel-serial-waterfall-and-queues-6f9c4badbc17

Parallel : When we have to run multiple tasks independent of each other
without waiting until the previous task has completed, parallel comes
into the picture.
async.parallel(tasks, callback)

Series
When we have to run multiple tasks which depend on the output of the
previous task
async.series(tasks, callback)

Waterfall : When we have to run multiple tasks which depend on the output of
the previous task, Waterfall can be helpful.
async.waterfall(tasks, callback)

Queue
When we need to run a set of tasks asynchronously, a queue can be used. A
queue object based on an asynchronous function can be created which is
passed as a worker.
async.queue(task, concurrency)


Priority Queue
It is the same as the queue, the only difference being that a priority can be
assigned to the tasks which are considered in ascending order.
async.priorityQueue(task,concurrency)

Race
It runs all the tasks in parallel, but as soon as any of the function
completes its execution or passes an error to its callback, the main
callback is immediately called.
async.race(tasks, callback)


### Chapter 5 - Template Primer
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Template_primer

in atom - install pug plugin for highlighted syntax.
atom > packages > settings view > open > select pug (currently version 0.8.0)
https://pugjs.org/api/getting-started.html
nb: pug already installed via the package.json
https://html2jade.org/
converts html to pug

### Part 5: Displaying library data

after updating /controllers/bookController.js method book_list() to load a view,
 if book_list.pug is missing from views/ then this error. (duh obvious!)
Failed to lookup view "book_list" in views directory "/mnt/d/2019_working/coding/mdn_Mongoose_tutorial/express-locallibrary-tutorial/views"


### Part 5-6:  BookInstance list page
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_list_page


### Part 5-7:  Date formatting using moment
npm install moment
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Date_formatting_using_moment
https://momentjs.com/docs/

### Part 5-8: Author list page and Genre list page challenge
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_list_page
this is broken atm.

### Part 5-9 Book Detail
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data
this is broken atm.


### Part 6 Working with forms
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
npm install express-validator

### Part 6-1 Create genre form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_genre_form
to check genre added to database.
mongo
show dbs
use my_database
show collections
db.genreinstances.find()

### Part 6-2 Create Author form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_author_form
to check authors added to database.
db.authors.find()


### Part 6-3 Create Book form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_book_form
db.books.find()

### Part 6-4 Create BookInstance form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_BookInstance_form

### Part 6-5 Delete Author form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Delete_author_form
#list authors before and after deleting, check list in browser and in mongo
db.authors.find()

### Part 6-6 Update Book form
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Update_Book_form
db.books.find()
