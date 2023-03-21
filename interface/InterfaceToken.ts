interface Token {
    id: string,
    symbol: string,
    name: string,
    platforms: {
        ethereum: string
    }
};

export default Token;