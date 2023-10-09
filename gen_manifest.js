const fs = require('fs').promises;

const obj = {
    "sequences": [{
        "@type": "sc:Sequence",
        "canvases": [],
        "viewingDirection": "left-to-right",
        "viewingHint": "paged"
    }]
};

async function magic() {
    let id = 0;

    while (true) {
        ++id;

        const urlInfoJson = `https://iiif.bsr.ac.uk/iiif/2/GELL-VI%2Fwg_06_${makeId(id)}.tif/info.json`;

        let infoJson;
        try {
            infoJson = await fetch(urlInfoJson).then(r => r.json());
        } catch (e) {
            break;
        }

        console.log(id);

        const objImage = {
            "@id": urlInfoJson,
            "@type": "sc:Canvas",
            label: `Page ${id}`,
            width: infoJson.width,
            height: infoJson.height,
            images: [{
                "@id": urlInfoJson,
                "@type": "oa:Annotation",
                motivation: "sc:painting",
                resource: {
                    "@id": urlInfoJson,
                    "@type": "dctypes:Image",
                    format: "image\/jpeg",
                    service: {
                        "@context": "http:\/\/iiif.io\/api\/image\/2\/context.json",
                        "@id": `https://iiif.bsr.ac.uk/iiif/2/GELL-VI%2Fwg_06_${makeId(id)}.tif`,
                        profile: "http:\/\/iiif.io\/api\/image\/2\/level2.json"
                    },
                    width: infoJson.width,
                    height: infoJson.height,
                }
            }]
        };

        obj.sequences[0].canvases.push(objImage);

        await fs.writeFile("manifest.json", JSON.stringify(obj, null, 3));
    }
}

magic();


function makeId(id) {
    if (id < 10) return `00${id}`;
    if (id < 100) return `0${id}`;
    return id;
}
