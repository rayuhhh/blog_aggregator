import { readConfig } from "../config";
import { createFeed, printFeed } from "../lib/db/queries/feed";
import { getUser } from "../lib/db/queries/users"; 

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`Usage: ${cmdName} <name of feed> <url>`);
    }
    const config = readConfig();
    const currUser = config.currentUserName;
    const user = await getUser(currUser);
    if (!user) {
        throw new Error(`User: ${currUser} not found`);
    }
    const feed = await createFeed(args[0], args[1], user.id);
    printFeed(feed, user);
}