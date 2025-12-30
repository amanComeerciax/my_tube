const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    // jisko notification milegi (subscriber)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // jisne action kiya (channel owner)
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

    // kis video se related (new video upload)
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
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
