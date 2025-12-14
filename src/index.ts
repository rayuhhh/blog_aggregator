
import { XMLParser } from "fast-xml-parser";
import { CommandsRegistry, registerCommand, runCommand, } from "./commands/commands";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
import { handlerReset } from "./commands/reset";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed } from "./commands/feed";

import { readConfig } from "./config.js";
import { db, } from "./lib/db/index.js";
import { users } from "./lib/db/schema.js";





async function main() {
    // const result = await db.delete(users);
    // const currentUser = "Ray";
    // setUser(currentUser);
    // console.log("Hello, world!");

    // setUser("Ray");
    // const config = readConfig();
    // console.log(config);
    const argsFromCli: string[] = process.argv.slice(2); 
    
    if (argsFromCli.length < 1) {
        console.log("Usage: cli <command> [args...]");
        process.exit(1);
    }
    // if (!cmdName) {
    //     console.error("No command provided. Usage: cli <comand> [args...]");
    //     process.exitCode = 1;
    // } else if (argsForHandler.length < 1) {
    //     console.error("Username required.")
    //     process.exitCode = 1;
    // } else {
    //     setUser(argsForHandler[0]);
    //     const config = readConfig();
    //     console.log(config);
    // }

    const [cmdName, ...argsForHandler] = argsFromCli;
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset",  handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);
    

    try {
        await runCommand(registry, cmdName, ...argsForHandler);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    // const result1 = await db.delete(users);
    process.exit(0);
}

main();
