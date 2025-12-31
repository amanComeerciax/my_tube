const { createNotification } = require("../routes/notificationRoutes");
const User = require("../models/User");

/* =========================
   📹 NEW VIDEO UPLOAD
========================= */
async function notifyNewVideo(uploaderId, uploaderName, videoId) {
  try {
    // Get all subscribers of this channel
    const subscribers = await User.find({
      subscribedTo: { $in: [uploaderId] }
    }).select("_id");

    if (subscribers.length === 0) return;

    // Create notification for each subscriber
    const promises = subscribers.map(subscriber =>
      createNotification({
        userId: subscriber._id,
        senderId: uploaderId,
        type: "new_video",
        videoId: videoId,
        message: `${uploaderName} uploaded a new video`
      })
    );

    await Promise.all(promises);
    console.log(`✅ Notified ${subscribers.length} subscribers about new video`);
  } catch (err) {
    console.error("Error in notifyNewVideo:", err);
  }
}

/* =========================
   ❤️ VIDEO LIKE
========================= */
async function notifyLike(videoOwnerId, likerUserId, likerName, videoId) {
  try {
    await createNotification({
      userId: videoOwnerId,
      senderId: likerUserId,
      type: "like",
      videoId: videoId,
      message: `${likerName} liked your video`
    });
    console.log(`✅ Notified video owner about like`);
  } catch (err) {
    console.error("Error in notifyLike:", err);
  }
}

/* =========================
   💬 VIDEO COMMENT
========================= */
async function notifyComment(videoOwnerId, commenterUserId, commenterName, videoId) {
  try {
    await createNotification({
      userId: videoOwnerId,
      senderId: commenterUserId,
      type: "comment",
      videoId: videoId,
      message: `${commenterName} commented on your video`
    });
    console.log(`✅ Notified video owner about comment`);
  } catch (err) {
    console.error("Error in notifyComment:", err);
  }
}

/* =========================
   👤 NEW SUBSCRIBER
========================= */
async function notifySubscribe(channelOwnerId, subscriberUserId, subscriberName) {
  try {
    await createNotification({
      userId: channelOwnerId,
      senderId: subscriberUserId,
      type: "subscribe",
      videoId: null,
      message: `${subscriberName} subscribed to your channel`
    });
    console.log(`✅ Notified channel owner about new subscriber`);
  } catch (err) {
    console.error("Error in notifySubscribe:", err);
  }
}

module.exports = {
  notifyNewVideo,
  notifyLike,
  notifyComment,
  notifySubscribe
};