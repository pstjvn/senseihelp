goog.provide('help.topic');

goog.require('goog.events');
goog.require('goog.pubsub.TopicId');

/**
 * The pub/sub topics for this application.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
help.topic.SHOW_HELP_INTRO =
    new goog.pubsub.TopicId(goog.events.getUniqueId('hi'));

/** @type {!goog.pubsub.TopicId<number>} */
help.topic.SHOW_INDEXED_HELP =
    new goog.pubsub.TopicId(goog.events.getUniqueId('ih'));

/** @type {!goog.pubsub.TopicId<undefined>} */
help.topic.HIDE = new goog.pubsub.TopicId(goog.events.getUniqueId('h'));
