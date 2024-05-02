const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const bodyPaser = require('body-parser');
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyPaser.json());

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
    failureRedirect: '/404'
}));
app.get('/login', (request, response) => {
    return response.sendFile('login.html', { root: '.' });
});

app.post('/ctp/weekly', (req, res) => {
    const { id, nouveauTexte } = req.body;

    fs.readFile('ctp.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier HTML :', err);
            res.status(500).send('Une erreur est survenue lors de la lecture du fichier HTML.');
            return;
        }

        const $ = cheerio.load(data);
        if (nouveauTexte.startsWith("https://")) {
            $(`#${id}`).attr('src', nouveauTexte);
        } else {
            $(`#${id}`).text(nouveauTexte);
        }
        if (err) {
        console.log(err)
        }
        const nouvellePageHTML = $.html();

        fs.writeFile('ctp.html', nouvellePageHTML, 'utf8', (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier HTML :', err);
                res.status(500).send('Une erreur est survenue lors de l\'écriture du fichier HTML.');
                return;
            }
            res.status(200).send('La page HTML a été modifiée avec succès !');
        });
    });
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

app.get('/404', (request, response) => {
    response.status(404).sendFile('404.html', { root: '.' }); 
});

const port = 5500;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
