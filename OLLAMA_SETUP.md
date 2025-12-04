# Ollama — setup and notes (updated)

This document explains how to set up Ollama locally for enhanced AI features in SayLO. Ollama is optional — SayLO has built-in fallback behavior when Ollama is not available.

Prerequisites

- A machine with enough RAM for your chosen model (see model guidance below).
- Network access to localhost where Ollama serves (default http://localhost:11434).

1. Install Ollama

- Windows: download the Windows package from https://ollama.ai and run the installer.
- macOS: `brew install ollama` (if available on your setup).
- Linux: use the installer script from the official site:

```powershell
curl -fsSL https://ollama.ai/install.sh | sh
```

Verify the installation with:

```powershell
ollama --version
```

2. Start the Ollama daemon

```powershell
ollama serve
```

By default Ollama listens on `http://localhost:11434`.

3. Pull recommended models

Start with a small/medium model for local development. Example:

```powershell
ollama pull llama3.2:3b
```

Other options (resource-heavy):

```powershell
ollama pull llama3.2:8b
ollama pull codellama:7b
```

Resource guidance (approx):

- llama3.2:3b — low-to-moderate RAM (~4–6 GB)
- llama3.2:8b — higher RAM (~8+ GB)
- codellama:7b — higher RAM (8+ GB)

4. Verify models and run a quick test

```powershell
ollama list
ollama run llama3.2:3b "Hello, Ollama"
```

5. Integrate with SayLO

- Ensure `.env.local` contains:

```
VITE_OLLAMA_HOST=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b
```

- SayLO will detect Ollama at runtime and enable "Enhanced AI Mode" if reachable.

Troubleshooting

- Ollama not detected: ensure `ollama serve` is running and the host/port match `VITE_OLLAMA_HOST`.
- Model not found: run `ollama list` and pull the desired model.
- Connection refused: confirm no firewall is blocking `localhost:11434` and the service is up.
- Performance issues: use a smaller model or free memory by closing apps.

Logs

- Use `ollama logs` to inspect Ollama logs if available.

Security & privacy

- Running Ollama locally means models and data stay on the host machine. No external data is required for basic use.

Notes

- Ollama releases and CLI flags may change. If something fails, consult https://ollama.ai/docs for the latest instructions.

If you want, I can add a small script or npm task to detect Ollama during local startup and print clear instructions to the console.
