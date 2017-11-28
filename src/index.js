import $ from 'jquery';

import UI from 'odyssey/templates/UI';
import wayfinder from 'odyssey/lib/wayfinder';
import Location from 'odyssey/templates/Location';
import nlp from 'compromise';

const Odyssey = (() => {
    let throttledParse;

    const State = { location: null };

    let story;

    const localStorage = require('local-storage');

    const StateProxy = {
        set(target, key, value) {
            Object.assign(target, { [key]: value });
            $('span.odyssey-location').html(`<strong>@</strong> ${$('header span', target[key]).html()}`);
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
            name: name.replace(/[@#\\="]/g, ''),
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

    const processImages = (text) => {
        const regex = /(?:https?:\/\/[^ ]*\.(?:gif|png|jpg|jpeg))/;
        if (text.match(regex)) {
            $('> note main', stateProxy.location).prepend("<img src='"+ text.match(regex) +"' />");
        }
    };

    const readSentence = (sentence) => {
        const text = sentence.out('text').trim();

        const { location, routes, target } = wayfinder(text);

        let clean = text.replace(/[@#"=]/g, '').replace(/\[[^\]]*?\]/g, '');

        if (location) {
            stateProxy.location = findOrCreateLocationByName(location);
            if (clean) $('> note main', stateProxy.location).append(` ${clean}`);
        } else if (target) {
            if (clean) $('> note main', stateProxy.location).append(` ${clean}`);
            stateProxy.location = findOrCreateLocationByName(target);
        } else if (routes) {
            routes.forEach(route => findOrCreateLocationByName(route));
        } else {
            if (clean) $('> note main', stateProxy.location).append(` ${clean}`);
        }

        processImages(text);
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
        const title = ['Odyssey'];
        title[1] = sentence;
        $('header.odyssey-header').html(sentence);
        document.title = title.join(' - ');
    };

    const parse = () => {
        reset();

        story = $('.odyssey-editor').val();

        localStorage('Odyssey', story);

        if (story) {
            const sentences = nlp(story).sentences();
            sentences.forEach((sentence, i) => {
                if (i === 0) {
                    setTitle(sentence.out('text'));
                } else {
                    readSentence(sentence);
                }
            });
        } else {
            setTitle(null);
        }

        stylize();
    };

    const init = () => {
        if (!$('html').hasClass('odyssey-ready')) {
            $('body').append($(UI()));
            $('html').addClass('odyssey-aside-hidden')
                .addClass('odyssey-ready');
        }

        $('.odyssey-editor').val(localStorage('Odyssey'));

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
