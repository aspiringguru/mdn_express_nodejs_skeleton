var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};
//above added in tutorial 5-4 home page (replaced original content)

// Display list of all books.
exports.book_list = function(req, res) {
    //res.send('NOT IMPLEMENTED: Book list');
    //updated in part 5 - 5 Book_list_page
    Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
        //Successful, so render
        res.render('book_list', { title: 'Book List', book_list: list_books });
      });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    console.log("exports.book_detail start");
    //res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
    //error in this code block
    //Schema hasn't been registered for model "Genre". Use mongoose.model(name, schema)
    async.parallel({
        book: function(callback) {

            Book.findById(req.params.id)
              .populate('author')
              .populate('genre')
              .exec(callback);
        },
        book_instance: function(callback) {
          BookInstance.find({ 'book': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        console.log("exports.book_detail : function(err, results) ")
        if (err) {
          console.log("exports.book_detail : error : "+err);
          return next(err);
        }
        if (results.book==null) { // No results.
            console.log("exports.book_detail : Book not found")
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        console.log("exports.book_detail : Successful rendering");
        res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance } );
    });
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    console.log("exports.book_create_get : start");
    //res.send('NOT IMPLEMENTED: Book create GET');
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) {
          console.log("exports.book_create_get : err:"+err);
          return next(err);
        }
        console.log("exports.book_create_get : completed rendering.");
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
//console.log("exports.book_create_post : start.");

exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        console.log("exports.book_create_post : start1.");
        if(!(req.body.genre instanceof Array)){
            console.log("exports.book_create_post : !(req.body.genre instanceof Array)");
            if(typeof req.body.genre==='undefined') {
              console.log("exports.book_create_post : typeof req.body.genre==='undefined'");
              req.body.genre=[];
            } else {
              console.log("exports.book_create_post : typeof req.body.genre!=='undefined'");
              req.body.genre=new Array(req.body.genre);
            }
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('*').escape(),
    sanitizeBody('genre.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log("exports.book_create_post : start2.");

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            console.log("exports.book_create_post : !errors.isEmpty()");
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) {
                  console.log("exports.book_create_post : err="+err);
                  return next(err);
                }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                console.log("exports.book_create_post : errors.array()="+errors.array());
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            console.log("exports.book_create_post : Data from form is valid. Save book");
            book.save(function (err) {
                if (err) {
                  console.log("exports.book_create_post : book.save err="+err);
                  return next(err);
                }
                   // Successful - redirect to new book record.
                   console.log("exports.book_create_post : book.save success");
                   res.redirect(book.url);
                });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
    console.log("exports.book_update_get start");
    //res.send('NOT IMPLEMENTED: Book update GET');

    // Get book, authors and genres for form.
    async.parallel({
        book: function(callback) {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) {
              console.log("exports.book_update_get err:"+err);
              return next(err);
            }
            if (results.book==null) { // No results.
                console.log("exports.book_update_get : results.book==null, Book not found");
                var err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
            console.log("exports.book_update_get : success : rendering");
            res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
        });
};

// Handle book update on POST.
exports.book_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('author').escape(),
    sanitizeBody('summary').escape(),
    sanitizeBody('isbn').escape(),
    sanitizeBody('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log("exports.book_update_post");
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            console.log("exports.book_update_post : !errors.isEmpty()=true");
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) {
                  console.log("exports.book_update_post : err:"+err);
                  return next(err);
                }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                console.log("exports.book_update_post : completed, rendering.");
                res.render('book_form', { title: 'Update Book',authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
                console.log("exports.book_update_post : Book.findByIdAndUpdate : start");
                if (err) {
                  console.log("exports.book_update_post : Book.findByIdAndUpdate : Book.findByIdAndUpdate : err:"+err);
                  return next(err);
                }
                   // Successful - redirect to book detail page.
                   console.log("exports.book_update_post : Book.findByIdAndUpdate : successfull redir to "+thebook.url);
                   res.redirect(thebook.url);
                });
        }
    }
];
