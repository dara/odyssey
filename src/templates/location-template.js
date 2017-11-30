export default function locationTemplate({ slug, name }) {
    return `
        <li data-location-name="${slug}">
            <note>
                <header><span>${name}</span></header>
                <main></main>
            </note>
        </li>
    `;
}
