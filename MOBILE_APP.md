# App Mobile JL AXION

Base Android criada com Capacitor para reaproveitar a loja atual da JL AXION.

## O que foi preparado

- Projeto Android nativo em `android/`
- Configuracao do Capacitor em `capacitor.config.json`
- Shell mobile em `mobile-web/` gerado por `scripts/build-mobile-shell.mjs`
- App configurado para abrir a loja oficial em `https://jlaxion.com.br`

## Scripts

```bash
npm run mobile:build
npm run mobile:copy
npm run mobile:sync
npm run mobile:android
```

## Como testar com o dominio final

1. Garanta que `https://jlaxion.com.br` ja esteja funcionando
2. Rode:

```bash
npm run mobile:sync
```

3. Abra o projeto Android:

```bash
npm run mobile:android
```

## Como testar antes do dominio principal

Se quiser usar primeiro a URL da Railway:

1. Abra `capacitor.config.json`
2. Troque o valor de `server.url`
3. Rode:

```bash
npm run mobile:sync
```

## O que falta para gerar APK/AAB

Nesta maquina ainda falta o toolchain Android:

- Java/JDK
- Android Studio
- Android SDK configurado

Depois disso, o fluxo fica:

1. `npm run mobile:sync`
2. `npm run mobile:android`
3. No Android Studio, gerar `APK` ou `AAB`

## Publicacao futura

Quando o dominio estiver 100% validado e o visual final do app estiver fechado, o proximo passo ideal e:

1. ajustar icone e splash da marca
2. gerar `AAB`
3. preparar a ficha da Play Store
4. publicar o app da JL AXION
