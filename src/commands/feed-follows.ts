import { getFeedByUrl } from "src/lib/db/queries/feed";
import { createFeedFollow, getFeedFollowsForUser, } from "../lib/db/queries/feed-follows";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

import { argon2Sync } from "crypto";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage" ${cmdName} <feed_url>`);
    }
    
    // const config = readConfig();
    // const user = await getUser(config.currentUserName);

    // if(!user) {
    //     throw new Error(`Use ${config.currentUserName} not found`);
    // }

    const feedURL = args[0];
    const feed = await getFeedByUrl(feedURL);
    if (!feed) {
        throw new Error(`Feed not found: ${feedURL}`);
    }

    const ffRow = await createFeedFollow(user.id, feed.id);

    console.log(`Feed Follow created:`)
    printFeedFollow(ffRow.userName, ffRow.feedName);
}

export async function handlerListFeedFollows(_: string, user: User) {
    // const config = readConfig();
    // const user = await getUser(config.currentUserName);

    // if (!user) {
    //     throw new Error(`User: ${config.currentUserName}not found.`);
    // }

    const feedFollows = await getFeedFollowsForUser(user.id);
    if(feedFollows.length ===0) {
        console.log(`No feed follows found for this user.`);
        return;
    }

    console.log(`Feed follows for user %s:`, user.id);
    console.log(`User: ${user.name}.`)
    for (let ff of feedFollows) {
        console.log(`* %s`, ff.feedname);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
}