const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { AppError } = require('../utils/AppError');
const logger = require('../utils/logger');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    config.jwt.secret,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    config.jwt.refreshSecret,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new AppError('Name, email and password are required', 400, 'BAD_REQUEST'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400, 'EMAIL_IN_USE'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400, 'BAD_REQUEST'));
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401, 'UNAUTHORIZED'));
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new AppError('User not found', 401, 'UNAUTHORIZED'));
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      setRefreshTokenCookie(res, newRefreshToken);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (err) {
      return next(new AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED'));
    }
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.oauthLogin = async (req, res, next) => {
  try {
    const { provider, token } = req.body;
    if (!provider || !token) {
      return next(new AppError('Provider and OAuth token are required', 400, 'BAD_REQUEST'));
    }
    logger.info(`Processing OAuth login via ${provider}`);
    
    const email = `oauth_${provider}_user@example.com`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: `OAuth ${provider.toUpperCase()} User`,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
