var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    flash       = require("connect-flash");

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

mongoose.connect('mongodb://rafaelhonda:senha001@ds349455.mlab.com:49455/yelpcamp', {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// seedDB();
app.use(methodOverride('_method'));
app.use(
  require('express-session')({
    secret: 'Random text',
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = require('moment');
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, function() {
  console.log('Servers is running');
});
