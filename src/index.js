import $ from 'jquery';

import UI from 'odyssey/templates/UI';
import parseSentence from 'odyssey/lib/parse-sentence';
import Location from 'odyssey/templates/Location';
import nlp from 'compromise';

const Odyssey = (() => {
    let throttledParse;

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

    const isImage = url => new Promise((resolve) => {
        const image = new Image();

        image.onload = () => {
            resolve(image);
        };
        image.src = url;
    });

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
        const text = sentence.out('text');
        const { orientation, description, routes } = parseSentence(text);

        if (orientation) stateProxy.location = findOrCreateLocationByName(orientation);
        if (description) $('> note description', stateProxy.location).append(` ${description}`);
        if (routes) routes.forEach(route => findOrCreateLocationByName(route));

        const { location } = stateProxy;
        sentence.urls().forEach((urlNode) => {
            const url = urlNode.out('normal');
            isImage(url).then((image) => {
                $('description', location).before(image);
            });
        });

        // eslint-disable-next-line no-console
        console.log($(stateProxy.location).data('location-name'), text);
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

        const sentences = nlp($('.odyssey-editor').val()).sentences();
        sentences.forEach((sentence, i) => {
            if (i === 0) {
                setTitle(sentence.out('text'));
            } else {
                readSentence(sentence);
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

        $('.odyssey-editor').focus().keyup(() => {
            clearTimeout(throttledParse);
            throttledParse = setTimeout(parse, 150);
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
