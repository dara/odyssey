export default function Location({ slug, name }) {
    return `
        <li data-location-name="${slug}">
            <note>
                <header><span>${name}</span></header>
                <main></main>
            </note>
        </li>
    `;
}
