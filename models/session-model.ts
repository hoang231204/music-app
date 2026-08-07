import { Schema, model, Types } from 'mongoose';
export interface ISession {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    index: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = model<ISession>('Session', sessionSchema, 'sessions');

export default Session;