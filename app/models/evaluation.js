'use strict';

var mongoose = require('mongoose');
var EvaluationSchema = require('../schema/evaluation');

var Evaluation = mongoose.model('Evaluation', EvaluationSchema);

module.exports = Evaluation;