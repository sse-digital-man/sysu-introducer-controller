export const getUrl = (name: string) => {
    const url = `../assets/${name}`;
    return new URL(url, import.meta.url).href;
};

export const toUpperAtFirst = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};
