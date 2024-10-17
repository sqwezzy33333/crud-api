import {DEFAULT_PATH} from "../constants/constants";

export function subtractArrays(arr1: string[], arr2: string[]) {
    return arr1.filter(item => !arr2.includes(item));
}

export function getUuid(url: string): string | null {
    return url.replace(DEFAULT_PATH, '').split('/')[1] || null;
}
