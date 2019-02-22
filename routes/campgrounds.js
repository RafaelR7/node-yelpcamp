var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

// GET ALL
router.get('/', function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds });
    }
  });
});

// CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };

  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  };
  Campground.create(newCampground, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// ROUTE TO CREATE
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

// GET
router.get('/:id', function(req, res) {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// GET ONE AND ROUTE TO EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    res.render('campgrounds/edit', { campground: campground });
  });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findOneAndUpdate(
    { _id: req.params.id },
    req.body.campground,
    function(err, campground) {
      if (err) {
        res.redirect('/campgrounds');
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

// DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findOneAndRemove({ _id: req.params.id }, function(err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Campground deleted');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
