export default function UI() {
    return `<main class="odyssey-ui">
        <header class="odyssey-header"></header>
        <div class="odyssey-graph" data-location-name="Odyssey"></div>
    </main>
    <aside class="odyssey-ui">
        <textarea class="odyssey-editor">Emma's Journey

Emma is at @Moma's homepage. After briefly scanning the page she decides that the Explore Architecture section might be the best place to start rather than search.

[http://localhost:9000/images/random/Unknown-2.jpeg]
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
