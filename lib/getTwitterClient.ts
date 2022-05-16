import { TwitterApi } from 'twitter-api-v2'
import { db } from 'lib/firebase/server'

const clients = new Map<string, TwitterApi>();

export default async function getTwitterClient(uid: string): Promise<TwitterApi> {
  const exists = clients.get(uid);
  if (exists) {
    return exists;
  }

  const { token, secret } = await db
    .collection('users')
    .doc(uid)
    .get()
    .then((s) => s.data() as { token: string; secret: string });

  const client = new TwitterApi({
    appKey: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_KEY as string,
    appSecret: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_SECRET as string,
    accessToken: token,
    accessSecret: secret,
  });

  clients.set(uid, client);

  return client;
}
