import {DEFAULT_PATH} from "../constants/constants";

export function subtractArrays(arr1: string[], arr2: string[]) {
    return arr1.filter(item => !arr2.includes(item));
}

export function getUuid(url: string): string | null {
    return url.replace(DEFAULT_PATH, '').split('/')[1] || null;
}

export function parseArgs () {
    const filteredArguments = process.argv.slice(2);
    const args: Record<string, string> = {};
    filteredArguments.forEach((arg, i) => {
        if (i % 2 !== 0) {
            return;
        }
        const next = filteredArguments[i + 1];
        const key = arg.substring(2) as string;
        args[key] = next;
    })
    return args;
}
