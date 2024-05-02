const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');

passport.use(new DiscordStrategy({
    clientID: '1235220446085910610',
    clientSecret: 'nrijLKVVy_U1M1wse7trmjvtl9h_H-gA',
    callbackURL: 'http://localhost:5500/auth/discord/callback',
    scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        username: profile.username,
		Token: accessToken
    };
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

app.get('/', ensureAuthenticated, (request, response) => {
	return response.sendFile('accueil.html', { root: '.'});
});
app.get('/ctp/weekly', ensureAuthenticated, (request, response) => {
    return response.sendFile('ctp.html', { root: '.' });
});

app.get('/test', ensureAuthenticated, (request, response) => {
    return response.sendFile('test.html', { root: '.' });
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    successRedirect: '/dashboard',
    failureRedirect: '/test'
}));
app.get('/login', (request, response) => {
    return response.sendFile('login.html', { root: '.' });
});

app.get('/dashboard', ensureAuthenticated, (request, response) => {
    response.render('dashboard', { 
        username: request.user.username,
        userId: request.user.id,
		token: request.user.Token
    }); 
});

app.get('/', (request, response) => {
    if (request.isAuthenticated()) {
        return response.redirect('/dashboard');
    } else {
        return response.sendFile('accueil.html', { root: '.' });
    }
});

app.get('*', (request, response) => {
    response.status(404).sendFile('404.html', { root: '.' }); 
});

const port = 5500;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
