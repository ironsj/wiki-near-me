interface Article {
    title: string;
    lat: number;
    lon: number;
    pageid: number;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
};

export { Article };