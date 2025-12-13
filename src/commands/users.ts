import { setUser, readConfig } from "../config";
import { createUser, getUser } from "../lib/db/queries/users";
import { db, } from "../lib/db/index.js";
import { users } from "../lib/db/schema.js";


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(existingUser.name);
    console.log("User has been switched successfully.");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const newUser = await createUser(userName);
    if (!newUser) {
        throw new Error(`User ${userName} not found`);
    }
    setUser(newUser.name);
    console.log(`User: ${userName} created successfully!`);
}


export async function handlerUsers(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`Usage: ${cmdName}`);
    }
    const names = await db.select({name: users.name}).from(users);
    const config = readConfig();
    for (const user of names) {
        if (config.currentUserName != user.name) {
            console.log(user.name);
        } else {
            console.log(`${user.name} (current)`);
        }
    }
}
