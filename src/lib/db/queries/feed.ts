import { db } from "../index";
import { feeds, users } from "../schema";



export async function createFeed(name: string, url: string, userId: string) {
    try {
        const [newFeed] = await db.insert(feeds).values({
            name: name,
            url: url,
            user_id: userId,
        }).returning();
        
        return newFeed;
    } catch (err) {
        console.error("Error creating field:", err);
        throw err;
    }
}

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export function printFeed(feed: Feed, user: User) {
    console.log("--- Feed Item Details ---");
    console.log(`ID:        ${feed.id}`);
    console.log(`Name:      ${feed.name}`);
    console.log(`URL:       ${feed.url}`);
    console.log(`Created:   ${feed.createdAt.toLocaleDateString()}`);

    if (user) {
        console.log(`Author ID: ${user.id}`);
        console.log(`Author Name: ${user.name}`);
    } else {
        console.log(`User ID:   ${feed.user_id} (Author details not provided)`);
    }
    console.log("--------------------------");
}

export async function getFeeds() {
    return db.select().from(feeds);
}