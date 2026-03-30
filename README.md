# JL AXION

Loja premium de utilidades e tecnologia com frontend multipagina, backend em Express + SQLite e painel administrativo.

## O que ja esta pronto

- Home, categorias, produto, favoritos, carrinho, conta e checkout
- Backend com sessao, catalogo, favoritos, carrinho, perfil e pedidos
- Painel admin em `/admin.html` para gerenciar produtos, fornecedores e pedidos
- Projeto preparado para deploy com Docker e variaveis de ambiente
- Base de dropshipping com fornecedor, SKU externo, custo e repasse manual

## Rodando localmente

```bash
npm install
npm start
```

Depois abra:

- Loja: `http://localhost:3000`
- Admin: `http://localhost:3000/admin.html`

## Acessos seed

- Cliente: `cliente@jlaxion.com.br` / `axion123`
- Admin: `admin@jlaxion.com.br` / `axionadmin`

## Dropshipping

O painel admin ja esta preparado para a fase 1 e a fase 2 da operacao sem estoque:

- cadastro de fornecedores
- produto vinculado ao fornecedor
- SKU externo
- custo do parceiro
- prazo do parceiro por item
- repasse manual do pedido
- rastreio e referencia do fornecedor
- estrutura pronta para operacao hibrida no futuro

Guia operacional:

- [DROPSHIPPING.md](DROPSHIPPING.md)

## Deploy com Docker

1. Copie `.env.example` para `.env`
2. Ajuste principalmente `SESSION_SECRET` e a senha admin
3. Suba o projeto:

```bash
docker compose up --build -d
```

O banco SQLite fica persistido na pasta local `server-data/`, montada no container em `/data`.

## App Android

O projeto mobile foi preparado com Capacitor e plataforma Android nativa.

Scripts principais:

```bash
npm run mobile:build
npm run mobile:sync
npm run mobile:android
```

Arquivos principais do app:

- `capacitor.config.json`: configuracao do app e URL da loja carregada no mobile
- `android/`: projeto Android nativo
- `scripts/build-mobile-shell.mjs`: shell local usado pelo Capacitor

Observacoes:

- O app esta apontado para `https://jlaxion.com.br`
- Se quiser testar antes do dominio principal responder, troque a `server.url` em `capacitor.config.json` para a URL da Railway e rode `npm run mobile:sync`
- Para gerar APK ou AAB, ainda e necessario instalar Java/JDK e Android Studio nesta maquina

## Variaveis de ambiente

- `PORT`: porta HTTP do servidor
- `SESSION_SECRET`: chave da sessao
- `DATA_DIR`: pasta onde o banco SQLite sera salvo
- `DB_PATH`: caminho completo do banco, se quiser sobrescrever `DATA_DIR`
- `SESSION_DB_PATH`: caminho completo do banco de sessoes SQLite
- `SESSION_COOKIE_NAME`: nome do cookie de sessao
- `ADMIN_NAME`: nome exibido para a conta admin seed
- `ADMIN_EMAIL`: e-mail da conta admin seed
- `ADMIN_PASSWORD`: senha da conta admin seed

## Estrutura principal

- `server.js`: backend e API
- `app.js`: frontend da loja
- `admin.js`: frontend do painel admin
- `styles.css`: identidade visual e responsividade
- `docker-compose.yml`: subida local para deploy/container
- `Dockerfile`: imagem da aplicacao
