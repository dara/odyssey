import parseSentence from './parse-sentence';

describe('parseSentence', () => {
    test('should be able to parse example 1', () => {
        const example = 'Emma is at @Moma\'s homepage. After briefly scanning the page she decides that the Explore Architecture section might be the best place to start rather than search.';
        expect(parseSentence(example)).toMatchSnapshot();
    });

    test('should be able to parse example 2', () => {
        const example = 'She sees options to view ="Feature Based Content" and also an area called ="Themes with Links" to the various themes.';
        expect(parseSentence(example)).toMatchSnapshot();
    });

    test('should be able to parse example 3', () => {
        const example = 'Emma chooses to @"Browse by Style" having seen some of the Art Deco pictures in her original search.';
        expect(parseSentence(example)).toMatchSnapshot();
    });
});
