import mongoose from 'mongoose';
import {serviceSchema} from '../schema/service';

export const Service = mongoose.model('Service',serviceSchema);