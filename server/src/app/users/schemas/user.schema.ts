import { compare, hashSync } from 'bcrypt';
import { Schema } from 'mongoose';

import { User, UserRole, UserStatus } from '../../common/interfaces';

// User mongoose schema
export const UserSchema = new Schema({
  login: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  roles: {
    type: [String],
    required: true,
    default: [UserRole.USER],
  },
  refreshToken: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: [UserStatus.INACTIVE],
  },
  confirmToken: {
    type: String,
  },
});

// Creates index for unique constraints on login and email
UserSchema.index({ login: 1, email: 1 }, { unique: true });

/**
 * Pre save hook, encrypts user password before persist
 *
 * @private
 * @param {(...params: any) => void} next callback to pass control to next middleware
 * @memberof UserSchema
 */
UserSchema.pre<User>('save', function(this: User, next: (...params: any) => void) {
  if (this.isModified('password')) this.password = hashSync(this.password, 10);
  next();
});

/**
 * Compares a candidate password with user password
 *
 * @param {string} candidatePassword candidate password
 * @return {Promise<boolean>} resolved with match result, rejected on error
 * @memberof UserSchema
 */
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await compare(candidatePassword, this.password);
};
