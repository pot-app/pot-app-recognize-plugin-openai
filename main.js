async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    let { model = "gpt-4o", apiKey, requestPath, customPrompt } = config;

    if (!requestPath) {
        requestPath = "https://api.openai.com";
    }
    if (!/https?:\/\/.+/.test(requestPath)) {
        requestPath = `https://${requestPath}`;
    }
    if (requestPath.endsWith('/')) {
        requestPath = requestPath.slice(0, -1);
    }
    if (!requestPath.endsWith('/chat/completions')) {
        requestPath += '/v1/chat/completions';
    }
    if (!customPrompt) {
        customPrompt = "Just recognize the text in the image. Do not offer unnecessary explanations.";
    }else{
        customPrompt = customPrompt.replaceAll("$lang", lang);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model,
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": customPrompt
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": `data:image/png;base64,${base64}`,
                            "detail": "high"
                        },
                    },
                ],
            }
        ],
    }
    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });

    if (res.ok) {
        let result = res.data;
        return result.choices[0].message.content;
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
