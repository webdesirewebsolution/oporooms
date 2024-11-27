export function compareArray<T extends object>(array1: T[], array2: T[], key: keyof T): boolean {
    const keySet1 = new Set(array1.map(obj => obj[key]));
    const keySet2 = new Set(array2.map(obj => obj[key]));

    // Compare the sets to check for equality
    return keySet1.size === keySet2.size && [...keySet1].every(key => keySet2.has(key));
}
