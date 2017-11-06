export default function Location({ slug, name/* , description */ }) {
    return `
        <li data-location-name="${slug}">
            <note>
                <name><span>${name}</span></name>
                <description></description>
            </note>
        </li>
    `;
}
