import mongoose from 'mongoose';
import {addressSchema} from '../schema/address';

export const Address = mongoose.model('Address',addressSchema);