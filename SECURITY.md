# Security Guidelines

## Environment Variables

**CRITICAL**: Never commit API keys or sensitive data to git.

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Replace placeholder values with your actual API keys:
   ```env
   VITE_OPENAI_API_KEY=your_actual_api_key_here
   VITE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   ```

### Protected Files

The following files are automatically ignored by git:
- `.env`
- `.env.*` (except `.env.example`)
- `api-keys.json`
- `secrets.json`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`

### Security Checklist

- [ ] All API keys are in `.env` files
- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded keys in source code
- [ ] Use `import.meta.env.VITE_*` for environment variables
- [ ] Never log API keys to console

### If You Accidentally Commit Keys

1. Immediately revoke/regenerate the exposed keys
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push to remote (if safe to do so)