'use strict';

import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import {authTypes, validateEmptyEmail, validateEmptyPassword} from './user.validations';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: String,
  description: {
    type: String,
    maxlength: 350
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    validate: [
      {validator: validateEmptyEmail, msg: 'email cannot be blank'},
    ],
    index: {
      unique: true
    }
  },
  profileImageUrl: {
    type: String,
    default: 'assets/images/default/default-avatar.png'
  },
  coverImageUrl: {
    type: String,
    default: 'assets/images/default/default-avatar.png'
  },
  gender: {
    type: String,
    lowercase: true,
    enum: ['m', 'f']
  },
  role: {
    type: String,
    default: 'user'
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  phone: String,
  occupation: {
    type: String,
    enum: ['N/D', 'Entrepreneur', 'Businessman', 'Student', 'Employee', 'Unemployed', 'Other']
  },
  birthdate: Date,
  hashedPassword: {
    type: String,
    validate: [
      {validator: validateEmptyPassword, msg: 'Password cannot be blank'}
    ]
  },
  provider: String,
  salt: String,
  language: String,
  races: [{
    raceId: String
  }],
  messageConversations: {
    type: [{
      messageConversationId: String,
      receiver: {
        receiverId: String,
        name: String
      },
      lastMessage: String,
      lastUpdate: Date,
    }], default: []
  },
  isValid: Boolean,
  validateToken: String,
  passwordToken: String,
  resetPasswordExpires: Date,
  status: String,
  active: {
    default: true,
    type: Boolean
  }
});

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'email': this.email,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

const validatePresenceOf = (value) => {
  return value && value.length;
};

UserSchema.method('authenticate', function (plainText: string): boolean {
  return this.encryptPassword(plainText) === this.hashedPassword;
});

UserSchema.method('makeSalt', function (): string {
  return crypto.randomBytes(16).toString('base64');
});

UserSchema.method('encryptPassword', function (password: string): string {
  if (!password || !this.salt) {
    return '';
  }
  const salt = new Buffer(this.salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('base64');
});

/**
 * Pre-saveHandler hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) {
      return next();
    }

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

export default (UserSchema);

