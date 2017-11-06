var Odyssey = (function() {

    const State = {
        location: null
    };

    const StateProxy = {
        set(target, key, value) {
            target[key] = value;
            $('span.odyssey-location').html("<strong>@</strong> " + $("name span", target[key]).html());
        },
    };

    const stateProxy = new Proxy(State, StateProxy);

    var removeBrackets = function(str) {
        return str.replace(/[[|\]]/g,'')
    }

    var toSlug = function(name) {
        return name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    }

    var init = function() {
        if (!$('html').hasClass('odyssey-ready')) {
            $('body').prepend($(Header()))
                .append($(Graph()))
                .append($(Editor()))
                .append($(StatusBar()));

            $('html').addClass('odyssey-editor-hidden')
                .addClass('odyssey-ready');
        }

        $(".odyssey-editor").focus().keyup(function(event) {
            if (event.which == 13 || event.which == 190 || event.which == 38 || event.which == 40) {
                parse();
                event.preventDefault();
            }
        });

        $('.odyssey-toggle-editor').click(function(e){
            $('html').toggleClass('odyssey-editor-hidden');
        });

        parse();
    }

    var setTitle = function(sentence) {
        $('header.odyssey-header').html(sentence);
        document.title = "Odyssey - " + sentence;
    }

    var orientation = function(sentence) {
        var regexp = new RegExp('((\\S*@".*")|\\S*@(?:\\[[^\\]]+\\]|\\S+))', "ig");
        match = removeBrackets(sentence).match(regexp);

        if (match) {
            stateProxy.location = findOrCreateLocationByName(match[0]);
            return true;
        }
    }

    var findRoutes = function(sentence) {
        var paths = [],
            regexp = new RegExp('((\\S*=".*?")|\\S*=(?:\\[[^\\]]+\\]|\\S+))', "ig");

        while ((match=regexp.exec(removeBrackets(sentence))) !== null) {
            findOrCreateLocationByName(match[0]);
        }
    }

    var findLocationByName = function(name) {
        results = $('[data-location-name="'+ toSlug(name) +'"]');

        return results.length ? results[0] : null;
    }

    var findOrCreateLocationByName = function(name) {
        result = findLocationByName(name);

        if (!result) {
            result = addLocation(name);
        }

        return result;
    }

    var setDescription = function(sentence) {
        // regex to remove some chars and things between square brackets
        var clean = sentence.replace(/[@"=]/g, "").replace(/\[[^\]]*?\]/g, '');

        $('> note description', stateProxy.location).append(" " + clean);
    }

    var addLocation = function(name) {
        if (stateProxy.location == null) {
            stateProxy.location = $('.odyssey');
        }

        $(stateProxy.location).not(":has(ol)").append("<ol></ol>");

        var newLocation = $(Location(
            {
                slug: toSlug(name),
                name: name.replace(/[@\\="]/g, "")
            }
        ));

        $(stateProxy.location).find('> ol').append(newLocation);

        return newLocation;
    }

    var parseSentence = function(sentence) {

        orientation(sentence);

        setDescription(sentence);

        findRoutes(sentence);

        console.log($(stateProxy.location).data('location-name'), sentence);
    }

    var stylize = function() {
        $(".odyssey-graph li:has(ol)").each(function() {
            $(this).addClass('branch');
        });

        $(".odyssey-graph li:not(:has(ol))").each(function() {
            $(this).addClass('leaf');
        });

        $('note').click(function(e) {
            if ($(this).parent().has('ol').length > 0) {
                $(this).parent().toggleClass('hidden');
            }
        });

        $(".focus").removeClass("focus");
        $('> note', stateProxy.location).addClass('focus');
    }

    var reset = function() {
        stateProxy.location = $('.odyssey-graph').empty();
    }

    var parse = function() {
        reset();

        var lines = $('.odyssey-editor').val().match(/[^\r\n]+/g);

        lines.map(function(line) {
            return line.trim();
        });

        setTitle(lines[0]);

        for (i=1; i<lines.length; i++) {
            var sentences = lines[i].match(/[^\.!\?]+[\.!\?]+/g);

            for (j=0; j<sentences.length; j++) {
                parseSentence(sentences[j]);
            }
        }

        stylize();
    }

    return {
        init: init
    };
})();
