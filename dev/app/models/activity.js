import mongoose from 'mongoose';
import {activitySchema} from '../schema/activity';

export const Activity = mongoose.model('Activity',activitySchema);