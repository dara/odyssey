import $ from 'jquery';

import UI from 'odyssey/templates/UI';
import Location from 'odyssey/templates/Location';

const Odyssey = (() => {
    const State = {
        location: null,
    };

    const StateProxy = {
        set(target, key, value) {
            Object.assign(target, { [key]: value });
            $('span.odyssey-location').html(`<strong>@</strong> ${$('name span', target[key]).html()}`);
            return true;
        },
    };

    const stateProxy = new Proxy(State, StateProxy);

    const removeBrackets = str => `${str}`.replace(/[[|\]]/g, '');

    const toSlug = name => name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const findLocationByName = (name) => {
        const results = $(`[data-location-name="${toSlug(name)}"]`);

        return results.length ? results[0] : null;
    };


    const addLocation = (name) => {
        if (stateProxy.location == null) {
            stateProxy.location = $('.odyssey');
        }

        $(stateProxy.location).not(':has(ol)').append('<ol></ol>');

        const newLocation = $(Location({
            slug: toSlug(name),
            name: name.replace(/[@\\="]/g, ''),
        }));

        $(stateProxy.location).find('> ol').append(newLocation);

        return newLocation;
    };

    const findOrCreateLocationByName = (name) => {
        let result = findLocationByName(name);

        if (!result) {
            result = addLocation(name);
        }

        return result;
    };

    const orientation = (sentence) => {
        const regexp = new RegExp('((\\S*@".*")|\\S*@(?:\\[[^\\]]+\\]|\\S+))', 'ig');
        const match = removeBrackets(sentence).match(regexp);

        if (match) {
            stateProxy.location = findOrCreateLocationByName(match[0]);
            return true;
        }

        return false;
    };

    const setDescription = (sentence) => {
        // regex to remove some chars and things between square brackets
        const clean = sentence.replace(/[@"=]/g, '').replace(/\[[^\]]*?\]/g, '');

        $('> note description', stateProxy.location).append(` ${clean}`);
    };

    const findRoutes = (sentence) => {
        const regexp = new RegExp('((\\S*=".*?")|\\S*=(?:\\[[^\\]]+\\]|\\S+))', 'ig');
        const matches = removeBrackets(sentence).match(regexp);

        if (!matches) return;
        matches.forEach(match => findOrCreateLocationByName(match));
    };

    const parseSentence = (sentence) => {
        orientation(sentence);

        setDescription(sentence);

        findRoutes(sentence);

        // eslint-disable-next-line no-console
        console.log($(stateProxy.location).data('location-name'), sentence);
    };

    const stylize = () => {
        $('.odyssey-graph li:has(ol)').each((i, item) => {
            $(item).addClass('branch');
        });

        $('.odyssey-graph li:not(:has(ol))').each((i, item) => {
            $(item).addClass('leaf');
        });

        $('note').on('click', (event) => {
            if ($(event.currentTarget).parent().has('ol').length > 0) {
                $(event.currentTarget).parent().toggleClass('hidden');
            }
        });

        $('.focus').removeClass('focus');
        $('> note', stateProxy.location).addClass('focus');
    };

    const reset = () => {
        stateProxy.location = $('.odyssey-graph').empty();
    };

    const setTitle = (sentence) => {
        $('header.odyssey-header').html(sentence);
        document.title = `Odyssey - ${sentence}`;
    };

    const parse = () => {
        reset();

        const lines = $('.odyssey-editor').val().match(/[^\r\n]+/g);

        lines.map(line => line.trim());

        setTitle(lines[0]);

        lines.forEach((line) => {
            const sentences = line.match(/[^\\.!\\?]+[\\.!\\?]+/g);
            if (sentences) {
                sentences.forEach((sentence) => {
                    parseSentence(sentence);
                });
            }
        });

        stylize();
    };

    const init = () => {
        if (!$('html').hasClass('odyssey-ready')) {

            $('body').append($(UI()));

            $('html').addClass('odyssey-aside-hidden')
                .addClass('odyssey-ready');
        }

        $('.odyssey-editor').focus().keyup((event) => {
            if ([13, 190, 38, 40].includes(event.which)) {
                parse();
                event.preventDefault();
            }
        });

        $(document).focus().keypress('o', (event) => {
            if (event.ctrlKey) {
                $('html').toggleClass('odyssey-aside-visible');
            }
        });

        parse();
    };

    return {
        init,
    };
})();


export default Odyssey;
