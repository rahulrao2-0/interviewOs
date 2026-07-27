import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---- Step 1: Redirect user to Google's consent screen ----
router.get('/google', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// ---- Step 2: Handle Google's callback ----
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing authorization code');

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Verify id_token before trusting it
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // payload: { sub, email, email_verified, name, picture, ... }

    // ---- Find or create user in your DB ----
    // Replace this with your real DB lookup/creation logic, e.g.:
    // let user = await User.findOne({ googleId: payload.sub });
    // if (!user) user = await User.create({ googleId: payload.sub, email: payload.email, name: payload.name });
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    // ---- Create your own app JWT ----
    const appToken = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ---- Set httpOnly cookie ----
    res.cookie('token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(process.env.CLIENT_SUCCESS_REDIRECT || '/dashboard');
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.redirect(process.env.CLIENT_FAILURE_REDIRECT || '/login?error=oauth_failed');
  }
});

// ---- Logout ----
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect(process.env.CLIENT_FAILURE_REDIRECT || '/login');
});

export default router;