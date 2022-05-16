import type { NextApiRequest, NextApiResponse } from 'next';
import getTwitterClient from 'lib/getTwitterClient'

type Body = {
  uid: string;
  tweet: string;
  tweetId: string;
};

type Res = {
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
) {
  const { uid, tweet, tweetId } = req.body as Body;
  const client = await getTwitterClient(uid);
  const { id_str: id } = await client.v1.tweet(tweet, {
    in_reply_to_status_id: tweetId,
  });

  res.status(200).json({ id });
}
