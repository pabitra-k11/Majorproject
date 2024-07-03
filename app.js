
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingsRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const userRouter = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

let dbURL=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret:process.env.SECERET,

    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error occured in SESSION Store",err);
});

const sessionOptions = {
    secret:process.env.SECERET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
    store,
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.errorMsg = req.flash('error');
   res.locals.currUser=req.user;
    next();
});


main().then(() => {
    console.log('connected to db!');
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbURL);
}

// root route
// app.get('/', (req, res) => {
//     res.send('I am root');
// });

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

app.use((err, req, res, next) => {
    let { message } = err;
    res.render('./listings/error', { message });
});



app.listen(8080, () => {
    console.log('server is listening on port: 8080');
});
