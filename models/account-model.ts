import mongoose, { Document, Schema } from "mongoose";

export interface ICreatedBy {
  account_id?: string;
  createdAt: Date;
}

export interface IDeletedBy {
  account_id?: string;
  deletedAt?: Date;
}

export interface IUpdatedBy {
  account_id?: string;
  updatedAt: Date;
}

export interface IAccount extends Document {
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  phone?: string;
  role_id?: string;
  status: 'active' | 'inactive';
  deleted: boolean;
  createdBy?: ICreatedBy;
  deletedBy?: IDeletedBy;
  updatedBy?: IUpdatedBy[];
}

const accountSchema = new Schema<IAccount>({
  fullname: { type: String },
  username: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  avatar: { type: String },
  phone: { type: String },
  role_id: {
    type: String,
    ref: "Role",
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    account_id: {
      type: String,
      ref: "Account",
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  deletedBy: {
    account_id: {
      type: String,
      ref: "Account"
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  },
  updatedBy: [
    {
      account_id: {
        type: String,
        ref: "Account"
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Account = mongoose.model<IAccount>('Account', accountSchema, "accounts");
export default Account;