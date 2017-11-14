import $ from 'jquery';

import UI from 'odyssey/templates/UI';
import parseSentence from 'odyssey/lib/parse-sentence';
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

    const readSentence = (sentence) => {
        const { orientation, description, routes } = parseSentence(sentence);

        if (orientation) stateProxy.location = findOrCreateLocationByName(orientation);
        if (description) $('> note description', stateProxy.location).append(` ${description}`);
        if (routes) routes.forEach(route => findOrCreateLocationByName(route));

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
                    readSentence(sentence);
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
