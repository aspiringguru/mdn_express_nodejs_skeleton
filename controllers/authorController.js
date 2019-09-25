const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var Author = require('../models/author');
var Genre = require('../models/genre');

// Display list of all Authors.
//https://mongoosejs.com/docs/api.html#query_Query-find
//https://mongoosejs.com/docs/api.html#query_Query-sort
exports.author_list = function(req, res) {
    console.log("authorController.js : exports.author_list start");
    //res.send('NOT IMPLEMENTED: Author list');
    Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) {
        console.log("error in authorController.js : exports.author_list")
        return next(err);
      }
      //Successful, so render
      console.log("authorController.js : exports.author_list success, rendering.");
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {
    console.log("exports.author_detail: start.");
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET.
exports.author_create_get = function(req, res, next) {
    console.log("exports.author_create_get start");//added tut section 6.2
    //res.send('NOT IMPLEMENTED: Author create GET');
    res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [

    //nb daisy chaining
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log("exports.author_create_post: start");
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("exports.author_create_post: Render form again with errors");
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            console.log("exports.author_create_post: Data from form is valid.");
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });
            author.save(function (err) {
                console.log("exports.author_create_post: author.save");
                if (err) {
                  console.log("exports.author_create_post: author.save err:"+err);
                  return next(err);
                }
                // Successful - redirect to new author record.
                console.log("exports.author_create_post: Successful - redirect to new author record.");
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
