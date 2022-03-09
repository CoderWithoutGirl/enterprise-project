const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  userId: {type: mongoose.Types.ObjectId, ref: "Users"},
  status: {type: String, enum: ["Like", "Dislike"]}
}, {
  timestamps: true
})
const CommentSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  content: {type: String, required: true},
}, {
  timestamps: true
})

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category", required: true},
  documentLink: {type: String, required: true},
  userId: {type: mongoose.Types.ObjectId, ref: 'Users'},
  reaction: [ReactionSchema],
  comment: [CommentSchema]
}, {timestamps: true});


const IdeaModel = mongoose.model('Ideas', IdeaSchema);

module.exports = IdeaModel;