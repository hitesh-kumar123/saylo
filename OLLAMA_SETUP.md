# Ollama Setup Guide for Enhanced AI Features

This guide will help you set up Ollama for advanced AI capabilities in SayLO.

## What is Ollama?

Ollama is a tool that allows you to run large language models locally on your machine. This enables SayLO to provide:

- Dynamic interview question generation
- Advanced response analysis
- Personalized feedback
- Real-time conversation flow

## Installation

### Windows

1. **Download Ollama**

   - Go to [https://ollama.ai](https://ollama.ai)
   - Download the Windows installer
   - Run the installer and follow the setup wizard

2. **Verify Installation**

   ```bash
   ollama --version
   ```

3. **Start Ollama Service**
   ```bash
   ollama serve
   ```

### macOS

1. **Install via Homebrew**

   ```bash
   brew install ollama
   ```

2. **Start Ollama Service**
   ```bash
   ollama serve
   ```

### Linux

1. **Install via curl**

   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama Service**
   ```bash
   ollama serve
   ```

## Model Setup

### Recommended Models

For optimal performance with SayLO, we recommend these models:

1. **Llama 3.2 3B** (Recommended for most users)

   ```bash
   ollama pull llama3.2:3b
   ```

2. **Llama 3.2 8B** (Better quality, requires more resources)

   ```bash
   ollama pull llama3.2:8b
   ```

3. **CodeLlama 7B** (Specialized for technical interviews)
   ```bash
   ollama pull codellama:7b
   ```

### System Requirements

| Model        | RAM | Storage | CPU    |
| ------------ | --- | ------- | ------ |
| llama3.2:3b  | 4GB | 2GB     | Any    |
| llama3.2:8b  | 8GB | 5GB     | Modern |
| codellama:7b | 8GB | 4GB     | Modern |

## Configuration

### 1. Start Ollama Service

Make sure Ollama is running before starting SayLO:

```bash
ollama serve
```

The service will run on `http://localhost:11434` by default.

### 2. Verify Model Availability

```bash
ollama list
```

You should see your downloaded models listed.

### 3. Test the Connection

```bash
ollama run llama3.2:3b "Hello, how are you?"
```

## SayLO Integration

### Automatic Detection

SayLO will automatically detect if Ollama is available and running. If detected, you'll see:

- "Enhanced AI Mode" indicator
- Dynamic question generation
- Advanced response analysis
- Real-time feedback

### Fallback Mode

If Ollama is not available, SayLO will automatically fall back to the built-in AI system with:

- Pre-defined question sets
- Basic response analysis
- Standard feedback

## Troubleshooting

### Common Issues

1. **Ollama not detected**

   - Ensure Ollama service is running (`ollama serve`)
   - Check if port 11434 is accessible
   - Restart SayLO application

2. **Model not found**

   - Verify model is downloaded (`ollama list`)
   - Pull the model if missing (`ollama pull llama3.2:3b`)

3. **Performance issues**

   - Try a smaller model (3B instead of 8B)
   - Close other applications to free up RAM
   - Check system requirements

4. **Connection errors**
   - Check firewall settings
   - Ensure Ollama is running on default port
   - Try restarting Ollama service

### Logs and Debugging

Check Ollama logs:

```bash
ollama logs
```

Check SayLO console for AI-related messages.

## Advanced Configuration

### Custom Model

To use a different model, modify the configuration in `src/services/ollamaService.ts`:

```typescript
const ollamaService = new OllamaService({
  model: "your-custom-model:tag",
  host: "http://localhost:11434",
  temperature: 0.7,
});
```

### Performance Tuning

For better performance, you can adjust:

- **Temperature**: Lower values (0.3-0.5) for more consistent responses
- **Top-p**: Higher values (0.8-0.9) for more diverse responses
- **Max tokens**: Adjust based on your needs

## Benefits of Enhanced AI

With Ollama enabled, SayLO provides:

1. **Dynamic Questions**: AI generates personalized questions based on responses
2. **Advanced Analysis**: Deep analysis of candidate responses
3. **Real-time Feedback**: Immediate suggestions and improvements
4. **Contextual Follow-ups**: Intelligent follow-up questions
5. **Comprehensive Summaries**: Detailed interview summaries

## Security and Privacy

- All AI processing happens locally on your machine
- No data is sent to external services
- Complete privacy and control over your data
- No API keys or external dependencies required

## Support

If you encounter issues:

1. Check this guide first
2. Review Ollama documentation: [https://ollama.ai/docs](https://ollama.ai/docs)
3. Check SayLO console for error messages
4. Ensure system meets requirements

## Next Steps

Once Ollama is set up:

1. Start SayLO application
2. Navigate to interview section
3. Look for "Enhanced AI Mode" indicator
4. Experience advanced AI-powered interviews!

---

**Note**: Ollama is optional. SayLO works perfectly without it using the built-in AI system.
