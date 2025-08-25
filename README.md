# Future Self Decision Advisor

AI-powered decision advisor that lets you chat with 4 versions of your future self based on different decision outcomes.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
### GPT-OSS Integration

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download a model
ollama pull llama3.2:3b
ollama serve
ollama run gpt-oss:20b
```