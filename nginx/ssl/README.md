# SSL Certificates

This directory is mapped to the Nginx container to provide SSL certificates.

For Nginx to start successfully, you must place your valid SSL certificates in this directory:
1. `fullchain.pem`
2. `privkey.pem`

## Generating Self-Signed Certificates (Local Testing)
If you want to test the setup locally and do not have certificates yet, you can generate self-signed (dummy) certificates using OpenSSL. Run this command from a terminal that has `openssl` installed (like Git Bash, WSL, or macOS/Linux):

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -subj "/CN=anuragswain.dev"
```

> **Note**: Your browser will show a warning when using self-signed certificates. You can safely ignore it for local testing.

## Production
For production, use a tool like Certbot to generate a free SSL certificate from Let's Encrypt and place the `.pem` files here.
