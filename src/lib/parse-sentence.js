const removeBrackets = str => `${str}`.replace(/[[|\]]/g, '');

const orientation = (sentence) => {
    const regexp = new RegExp('((\\S*@".*")|\\S*@(?:\\[[^\\]]+\\]|\\S+))', 'ig');
    const match = removeBrackets(sentence).match(regexp);

    if (match) return match[0];

    return null;
};

const description = (sentence) => {
    // regex to remove some chars and things between square brackets
    const clean = sentence.replace(/[@"=]/g, '').replace(/\[[^\]]*?\]/g, '');

    return clean;
};

const routes = (sentence) => {
    const regexp = new RegExp('((\\S*=".*?")|\\S*=(?:\\[[^\\]]+\\]|\\S+))', 'ig');
    const matches = removeBrackets(sentence).match(regexp);

    if (!matches) return null;
    return matches.map(match => match.toString());
};

export default function parseSentence(sentence) {
    return {
        orientation: orientation(sentence),
        description: description(sentence),
        routes: routes(sentence),
    };
}
