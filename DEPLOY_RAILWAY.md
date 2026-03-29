# Deploy Railway - JL AXION

## Estrategia recomendada

- Dominio principal da loja: `jlaxion.com.br`
- Dominio secundario: `jlaxion.club` redirecionando para `https://jlaxion.com.br`

## Antes de publicar

1. Suba este projeto para um repositorio GitHub
2. Crie um projeto novo na Railway
3. Conecte o repositorio e selecione este projeto
4. Anexe um volume persistente na Railway com mount path `/data`

## Variaveis de ambiente

Configure na Railway:

- `NODE_ENV=production`
- `PORT=3000`
- `SESSION_SECRET=troque-por-uma-chave-forte`
- `DATA_DIR=/data`
- `SESSION_DB_PATH=/data/sessions.sqlite`
- `SESSION_COOKIE_NAME=jlaxion.sid`
- `ADMIN_NAME=Admin JL AXION`
- `ADMIN_EMAIL=admin@jlaxion.com.br`
- `ADMIN_PASSWORD=troque-por-uma-senha-forte`

## Dominio principal

Use `jlaxion.com.br` como dominio principal.

Importante:

- A documentacao oficial da Railway informa que dominios raiz/apex exigem DNS com `CNAME flattening` ou `ALIAS`
- Se o seu DNS atual nao suportar isso, o caminho mais simples e seguro e delegar o DNS para a Cloudflare e gerenciar os registros por la

## DNS sugerido

Na Railway:

1. Gere primeiro o dominio fornecido pela Railway
2. Depois adicione o dominio customizado `jlaxion.com.br`
3. Copie o valor/target que a Railway mostrar

No DNS:

- `jlaxion.com.br` -> registro `CNAME`/flattening apontando para o target da Railway
- `www.jlaxion.com.br` -> `CNAME` apontando para `jlaxion.com.br`

## Dominio secundario

Para `jlaxion.club`, recomendo:

- nao conectar como dominio adicional agora
- criar redirecionamento `301` para `https://jlaxion.com.br`

Isso simplifica o plano inicial e evita custo desnecessario so para manter dois dominios ativos dentro da plataforma.

## Checklist final

- `https://jlaxion.com.br/api/health` responde `ok`
- login admin funcionando
- carrinho e checkout funcionando
- `robots.txt` e `sitemap.xml` publicados
- SSL emitido na Railway
