const removeBrackets = str => `${str}`.replace(/[[|\]]/g, '');

const location = (sentence) => {
    const regexp = new RegExp('((\\S*@".*")|\\S*@(?:\\[[^\\]]+\\]|\\S+))', 'ig');

    const match = removeBrackets(sentence).match(regexp);

    if (match) return match[0];

    return null;
};

const target = (sentence) => {
    const regexp = new RegExp('((\\S*#".*")|\\S*#(?:\\[[^\\]]+\\]|\\S+))', 'ig');

    const match = removeBrackets(sentence).match(regexp);

    if (match) return match[0];

    return null;
};

const routes = (sentence) => {
    const regexp = new RegExp('((\\S*=".*?")|\\S*=(?:\\[[^\\]]+\\]|\\S+))', 'ig');

    const matches = removeBrackets(sentence).match(regexp);

    if (matches) return matches.map(match => match.toString());

    return null;
};

export default function wayfinder(sentence) {
    return {
        location: location(sentence),
        target: target(sentence),
        routes: routes(sentence)
    };
}
