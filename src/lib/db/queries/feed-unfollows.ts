import { eq, and, } from "drizzle-orm";
import { feeds, feedFollows, users } from "../schema";
import { db } from ".."; // system intrinsically looks for 'index.ts'


export async function deleteFeedFollow(userId: string, url: string) {
    const [feedIdSubQuery] = await db.select({id: feeds.id}).from(feeds).where(eq(feeds.url,url));
    const feedId = feedIdSubQuery.id;

    const [deletedFeedFollow] = await db.delete(feedFollows).where(and(eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feedId))).returning();
    
    return deletedFeedFollow;
}