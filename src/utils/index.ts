export const getUrl = (name: string) => {
    const url = `../assets/${name}`;
    return new URL(url, import.meta.url).href;
};
