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
        customPrompt = "Recognize and transcribe all text visible in the image. Then, on a new line after \"========\", describe and explain the contents of the image, including any relevant visual elements, context, or meaning conveyed.";
    } else {
        customPrompt = customPrompt.replaceAll("$lang", lang);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    // 解码base64图片数据
    const imgData = atob(base64);

    // 如果图片大小小于1MB,则直接使用原始图片
    let compressedBase64;
    if (imgData.length <= 1024 * 1024) {
        compressedBase64 = base64;
    } else {
        // 创建Image对象
        const img = new Image();
        img.src = `data:image/png;base64,${base64}`;
        await new Promise((resolve) => {
            img.onload = resolve;
        });

        // 压缩图片
        const maxSize = 1400;
        const [width, height] = [img.width, img.height];
        const ratio = maxSize / Math.max(width, height);
        const newWidth = Math.floor(width * ratio);
        const newHeight = Math.floor(height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // 将压缩后的图片转换为base64,并确保大小不超过1MB
        let quality = 0.8;
        let compressedDataUrl;
        do {
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            quality -= 0.05;
        } while (compressedDataUrl.length > 1024 * 1024 && quality > 0.1);

        compressedBase64 = compressedDataUrl.split(',')[1];
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
                            "url": `data:image/jpeg;base64,${compressedBase64}`,
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
