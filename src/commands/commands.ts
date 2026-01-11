import { User } from "src/lib/db/schema";
import { getUser } from "../lib/db/queries/users";
import { readConfig } from "../config";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>; 

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;



export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
     registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    
    if (handler) {
        await handler(cmdName, ...args);
    } else{
        throw new Error(`Unknown command: ${cmdName}`);
    }
}

