const Header = () => `
    <header class="odyssey-header"></header>
`;

const Graph = () => `
    <main class='odyssey-graph' data-location-name='Odyssey'></main>
`;

const Editor = () => `
    <textarea class="odyssey-editor">Emma's Journey

Emma is at @Moma's homepage. After briefly scanning the page she decides that the Explore Architecture section might be the best place to start rather than search.

She sees options to view ="Feature Based Content" and also an area called ="Themes with Links" to the various themes.

Emma chooses to @"Browse by Style" having seen some of the Art Deco pictures in her original search.
</textarea>
`;

const StatusBar = () => `
    <footer class="odyssey-status-bar">
        <span class="odyssey-location"></span>
        <ul class="odyssey-menu">
            <li class=""><a class="odyssey-toggle-editor" href="#"><strong>|=</strong> Editor</a></li>
        </ul>
    </footer>
`;
