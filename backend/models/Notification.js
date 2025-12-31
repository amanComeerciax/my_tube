const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    // jisko notification milegi (subscriber/video owner)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // jisne action kiya (channel owner/liker/commenter)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // kis type ki notification
    type: {
      type: String,
      enum: ["like", "comment", "subscribe", "new_video"],
      required: true
    },

    // kis video se related (if applicable)
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    },

    // readable message
    message: {
      type: String,
      required: true
    },

    // read / unread
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

// Compound index for efficient queries
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1 });

// Auto-delete notifications older than 30 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("Notification", NotificationSchema);