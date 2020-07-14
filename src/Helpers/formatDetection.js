const formatDetection = (reference) =>
{
    const redExp = new RegExp("\\*r(.*?)\\*r")
    const blueExp = new RegExp("\\*b(.*?)\\*b")
    const boldExp = new RegExp("\\*{2}(.*?)\\*{2}")
    const phoneExp = new RegExp("(^|\\s)(\\+98|0)?\\d{4,11}")
    const urlExp = new RegExp("(^|\\s)(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[A-Za-z0-9@]+([\\-.][A-Za-z0-9@]+)*\\.[A-Za-z]{2,10}(:[0-9]{1,5})?(\\/[^\\s]*)?")
    const hashtagExp = new RegExp("(^|\\s)#[\u0600-\u06FFA-Za-z_‌]*")
    reference.innerHTML = reference.innerText
        .replace(new RegExp(redExp, "g"), (a, b) => `<span style="color: red">${b}</span>`)
        .replace(new RegExp(blueExp, "g"), (a, b) => `<span style="color: blue">${b}</span>`)
        .replace(new RegExp(boldExp, "g"), (a, b) => `<span style="font-weight: bold;color: var(--secondary-color)">${b}</span>`)
        .replace(new RegExp(urlExp, "g"), (a) =>
        {
            const word = a[0] === " " || a[0] === "\n" ? a.slice(1, a.length) : a
            return `<span style="color: blue;cursor: pointer;" title=${word} onclick="event.preventDefault(); window.open('${word.includes("@") ? `mailto:${word}` : word.includes("http") ? word : `http://${word}`}', '_blank')">${a.length > 60 ? a.slice(0, 60) + "..." : a}</span>`
        })
        .replace(new RegExp(hashtagExp, "g"), (a) =>
        {
            const word = a[0] === " " || a[0] === "\n" ? a.slice(1, a.length) : a
            return `<span style="color: blue;" title=${word}>${a}</span>`
        })
        .replace(new RegExp(phoneExp, "g"), (a) =>
        {
            const word = a[0] === " " || a[0] === "\n" ? a.slice(1, a.length) : a
            return `<span style="color: blue;cursor: pointer;" title=${word} onclick="event.preventDefault(); window.open('tel:${word}', '_blank')">${a}</span>`
        })
}

export default formatDetection