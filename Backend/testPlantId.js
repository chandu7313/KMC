import fs from 'fs';

async function test() {
    const apiKey = "OZL030feManEoua1D7PKggUcmISbHaIs8u3BcnKukvzqckbADe";
    const url = "https://plant.id/api/v3/health_assessment?details=description,treatment";
    const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Api-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                images: [dummyImage]
            })
        });

        const text = await response.text();
        console.log(text);
    } catch (e) {
        console.error(e);
    }
}

test();
