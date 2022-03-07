const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  userId: {type: mongoose.Types.ObjectId, ref: "Users"},
  actionType: {type: String, enum: ["Like", "Dislike"]}
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
  documentLink: {type: String},
  userId: {type: mongoose.Types.ObjectId, ref: 'Users'},
  reactions: [ReactionSchema],
  comments: [CommentSchema]
}, {timestamps: true});


const IdeaModel = mongoose.model('Ideas', IdeaSchema);

module.exports = IdeaModel;