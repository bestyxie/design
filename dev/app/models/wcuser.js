import mongoose from 'mongoose';
import {wcuserSchema} from '../schema/wcuser';

export const Wcuser = mongoose.model('Wcuser',wcuserSchema);