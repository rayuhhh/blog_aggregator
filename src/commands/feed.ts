import { db } from "src/lib/db";
import { readConfig } from "../config";
import { createFeed, /* printFeed, */ getFeeds } from "../lib/db/queries/feed";
import { getUser, getUsers } from "../lib/db/queries/users"; 
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { printFeedFollow } from "./feed-follows";


export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`Usage: ${cmdName} <name of feed> <url>`);
    }
    const config = readConfig();
    const currUser = config.currentUserName;
    const user = await getUser(currUser);
    if (!user) {
        throw new Error(`User: ${currUser} not found`);
    }
    const feed = await createFeed(args[0], args[1], user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    printFeedFollow(feed, user);
}

export async function handlerFeeds(_: string) {
    const feeds = await getFeeds();
    const users = await getUsers();

    for (const f of feeds) {
        console.log(`${f.name}`);
        console.log(`${f.url}`);
        const user = users.find(u => u.id === f.user_id)?.name;
        if (user) {
            console.log(`${user}`);
        }
    }
}

