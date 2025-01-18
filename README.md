# Pot-App OpenAI 文字识别插件

中文 | [English](README_EN.md)

本插件提供了与 OpenAI 和 Google Gemini API 集成的图像识别功能。

## API 密钥设置

### OpenAI API
1. 访问 [OpenAI API Keys](https://platform.openai.com/account/api-keys)
2. 创建新的 API 密钥
3. 复制密钥以供后续使用

### Google Gemini API
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 生成新的 API 密钥
3. 复制密钥以供后续使用

## API 端点配置

### OpenAI
- 默认端点：`https://api.openai.com`
- 如果使用官方 OpenAI API，无需指定 URL
- 对于第三方 OpenAI 兼容 API，可以自定义端点 URL

### Google Gemini
- 手動輸入此端点：`https://generativelanguage.googleapis.com`
- 使用 Gemini API 时必须指定此确切 URL