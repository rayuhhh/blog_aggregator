import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";



export async function createFeed(name: string, url: string, userId: string) {
    try {
        const newFeed = await db.insert(feeds).values({
            name: name,
            url: url,
            userId: userId,
        }).returning();
        
        return firstOrUndefined(newFeed);
    } catch (err) {
        console.error("Error creating field:", err);
        throw err;
    }
}



// export function printFeed(feed, user) {
//     console.log("--- Feed Item Details ---");
//     console.log(`ID:        ${feed.id}`);
//     console.log(`Name:      ${feed.name}`);
//     console.log(`URL:       ${feed.url}`);
//     console.log(`Created:   ${feed.createdAt.toLocaleDateString()}`);

//     if (user) {
//         console.log(`Author ID: ${user.id}`);
//         console.log(`Author Name: ${user.name}`);
//     } else {
//         console.log(`User ID:   ${feed.user_id} (Author details not provided)`);
//     }
//     console.log("--------------------------");
// }

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
}