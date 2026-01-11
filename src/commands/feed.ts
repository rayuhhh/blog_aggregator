
import { readConfig } from "../config";
import { createFeed, /* printFeed, */ getFeeds } from "../lib/db/queries/feed";
import { getUserById } from "../lib/db/queries/users"; 
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { printFeedFollow } from "./feed-follows";
import { Feed, User } from "src/lib/db/schema";


export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`Usage: ${cmdName} <name of feed> <url>`);
    }
    // const config = readConfig();
    // const currUser = config.currentUserName;

    // const user = await getUser(currUser);
    // if (!user) {
    //     throw new Error(`User: ${currUser} not found`);
    // }
    const feedName = args[0];
    const url = args[1];

    console.log('1');
    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    console.log('2');
    const feedFollow = await createFeedFollow(user.id, feed.id);
    printFeedFollow(user.name, feedFollow.feedName);
    console.log("Feed created successfully:");
    printFeed(feed, user);
}

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
        console.log(`User ID:   ${feed.userId} (Author details not provided)`);
    }
    console.log("--------------------------");
}

export async function handlerFeeds(_: string) {
    const feeds = await getFeeds();
    // const users = await getUsers();

    if(feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    console.log(`Found %d feeds:\n`, feeds.length);

    for (let f of feeds) {
        const user = await getUserById(f.userId)
        console.log(`${f.name}`);
        console.log(`${f.url}`);
        // const user = users.find(u => u.id === f.user_id)?.name;
        if (user) {
            console.log(`${user}`);
        }
    }
}

