import { PubSub } from "@google-cloud/pubsub";

/**
 * Creates the Pub/Sub topic and subscription for Gmail events
 * Run this once to set up your infrastructure
 */
export async function setupPubSubInfrastructure() {
  const projectId = process.env.GCP_PROJECT_ID;
  
  if (!projectId) {
    throw new Error("GCP_PROJECT_ID environment variable is required");
  }

  console.log(`[Setup] Setting up Pub/Sub infrastructure for project: ${projectId}`);
  
  const pubsub = new PubSub({ projectId });
  
  const topicName = "gmail-events";
  const subscriptionName = "gmail-events-sub";
  
  // Create topic if it doesn't exist
  const [topics] = await pubsub.getTopics();
  const topicExists = topics.some(t => t.name.endsWith(`/${topicName}`));
  
  let topic;
  if (!topicExists) {
    console.log(`[Setup] Creating topic: ${topicName}`);
    [topic] = await pubsub.createTopic(topicName);
    console.log(`[Setup] ✓ Topic created: ${topic.name}`);
  } else {
    console.log(`[Setup] Topic already exists: ${topicName}`);
    topic = pubsub.topic(topicName);
  }
  
  // Create subscription if it doesn't exist
  const [subscriptions] = await topic.getSubscriptions();
  const subExists = subscriptions.some(s => s.name.endsWith(`/${subscriptionName}`));
  
  if (!subExists) {
    console.log(`[Setup] Creating subscription: ${subscriptionName}`);
    const [subscription] = await topic.createSubscription(subscriptionName, {
      ackDeadlineSeconds: 30,
      // For push subscription (if you want to use HTTP push endpoint):
      // pushConfig: {
      //   pushEndpoint: 'https://yourdomain.com/api/pubsub/push'
      // }
    });
    console.log(`[Setup] ✓ Subscription created: ${subscription.name}`);
  } else {
    console.log(`[Setup] Subscription already exists: ${subscriptionName}`);
  }
  
  console.log("[Setup] ✓ Pub/Sub infrastructure is ready!");
  
  return {
    topicName: topic.name,
    projectId,
  };
}

/**
 * Check if Pub/Sub infrastructure exists
 */
export async function checkPubSubInfrastructure() {
  const projectId = process.env.GCP_PROJECT_ID;
  
  if (!projectId) {
    return { exists: false, error: "GCP_PROJECT_ID not set" };
  }

  try {
    const pubsub = new PubSub({ projectId });
    const topicName = "gmail-events";
    
    const [topics] = await pubsub.getTopics();
    const topicExists = topics.some(t => t.name.endsWith(`/${topicName}`));
    
    return { exists: topicExists, topicName, projectId };
  } catch (error: any) {
    return { exists: false, error: error.message };
  }
}

