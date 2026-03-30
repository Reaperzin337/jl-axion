# Dropshipping JL AXION

## Objetivo

Operar a JL AXION sem estoque fisico no comeco, usando repasse manual para fornecedores e deixando o painel pronto para evoluir depois para automacao e operacao hibrida.

## Fase 1

Fluxo operacional simples:

1. O cliente compra na loja.
2. O pedido cai no painel admin.
3. Voce abre o pedido e clica em `Copiar resumo para repasse`.
4. Envia o resumo ao fornecedor pelo canal combinado.
5. Atualiza o status operacional do pedido.
6. Quando tiver rastreio, registra no painel.

O que ja esta preparado no painel:

- cadastro de fornecedores
- contato, e-mail, telefone e canal de pedido
- prazo minimo e maximo do parceiro
- produto vinculado ao fornecedor
- SKU externo
- custo do fornecedor
- prazo do parceiro por produto
- link do parceiro
- observacoes internas de compra
- status comercial e operacional do pedido
- codigo de rastreio
- referencia do fornecedor
- bloco para copiar resumo de repasse

## Fase 2

Estrutura ja preparada para crescer:

- produtos com `fulfillmentMode`
- produtos com `supplierId`
- produtos com `supplierSku`
- produtos com `supplierCost`
- produtos com `supplierEtaDays`
- produtos com `supplierUrl`
- produtos com `procurementNotes`
- pedidos com `fulfillmentStatus`
- pedidos com `trackingCode`
- pedidos com `supplierReference`
- itens do pedido com snapshot do fornecedor

Isso deixa a loja pronta para no futuro receber:

- importacao por CSV
- integracao com portal do fornecedor
- automacao de repasse
- operacao mista entre estoque proprio e dropshipping

## Como operar no dia a dia

### Passo 1: cadastrar fornecedor

No painel admin:

1. Abra `admin.html`
2. Entre com a conta admin
3. No bloco `Base de parceiros da fase 1`, cadastre:
   - nome
   - responsavel
   - e-mail
   - telefone
   - prazo minimo e maximo
   - canal de pedido
   - site
   - observacoes

### Passo 2: vincular produto

No bloco `Cadastro e operacao dropshipping`:

1. escolha o produto ou crie um novo
2. mantenha `Dropshipping` no modo de operacao
3. selecione o fornecedor
4. preencha SKU externo
5. informe custo do parceiro
6. informe prazo do parceiro
7. salve

### Passo 3: repassar pedido

No bloco de pedidos:

1. abra o pedido
2. clique em `Copiar resumo para repasse`
3. cole no WhatsApp, e-mail ou portal do fornecedor
4. mude o status para `Repassado ao fornecedor`
5. atualize o status operacional
6. quando tiver rastreio, preencha no painel

## Recomendacao de lancamento

Antes de abrir a loja para trafego real:

1. validar 10 a 20 produtos com parceiro confiavel
2. confirmar prazo real de cada fornecedor
3. revisar politica de entrega, troca e devolucao
4. revisar texto de frete e prazo no site
5. confirmar quem vai atender pos-venda
6. so depois disso abrir o CNPJ e finalizar a operacao formal

## Observacao importante

Mesmo operando em dropshipping, a experiencia da loja continua sendo da JL AXION. Entao o cliente vai cobrar da sua marca prazo, atendimento e solucao. O fornecedor ajuda na entrega, mas a relacao com o cliente continua sendo sua.
