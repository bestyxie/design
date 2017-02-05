import mongoose from 'mongoose';
import {ReturnSchema} from '../schema/returns';

export const Returns = mongoose.model('Returns',ReturnSchema);