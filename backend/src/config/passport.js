const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db            = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('Conta Google sem e-mail.'));

        // Verificar se usuário já existe
        let result = await db.query(
          'SELECT id, name, email, role FROM users WHERE email = $1',
          [email.toLowerCase()]
        );

        if (result.rows.length > 0) {
          // Usuário já cadastrado — retorna ele
          return done(null, result.rows[0]);
        }

        // Primeiro acesso via Google — cria conta automaticamente como 'user'
        const name = profile.displayName || email.split('@')[0];
        result = await db.query(
          `INSERT INTO users (name, email, password_hash, role)
           VALUES ($1, $2, $3, 'user')
           RETURNING id, name, email, role`,
          [name, email.toLowerCase(), 'GOOGLE_OAUTH_NO_PASSWORD']
        );

        return done(null, result.rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialização mínima (só para a rota de callback)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1', [id]
    );
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
