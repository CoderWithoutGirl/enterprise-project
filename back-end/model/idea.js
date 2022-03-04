const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category", required: true},
  documentLink: {type: String, required: true}
}, {timestamps: true});


const IdeaModel = mongoose.model('Ideas', IdeaSchema);

module.exports = IdeaModel;