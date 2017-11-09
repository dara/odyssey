export default function UI() {
    return `<main class="odyssey-ui">
        <header class="odyssey-header"></header>
        <div class="odyssey-graph" data-location-name="Odyssey"></div>
    </main>
    <aside class="odyssey-ui">
        <textarea class="odyssey-editor">Emma's Journey

Emma is at @Moma's homepage. After briefly scanning the page she decides that the Explore Architecture section might be the best place to start rather than search.

She sees options to view ="Feature Based Content" and also an area called ="Themes with Links" to the various themes.

Emma chooses to @"Browse by Style" having seen some of the Art Deco pictures in her original search.
        </textarea>

        <footer class="odyssey-status-bar">
            <span class="odyssey-location"></span>
            <ul class="odyssey-menu">
                <li class=""></li>
            </ul>
        </footer>
    </aside>
    `;
}
