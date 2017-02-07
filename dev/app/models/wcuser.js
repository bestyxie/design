import mongoose from 'mongoose';
import {wcuserSchema} from '../schema/activity';

export const Wcuser = mongoose.model('Wcuser',wcuserSchema);