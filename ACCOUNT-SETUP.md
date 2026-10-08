# Card FC Brasil — contas e direção de marketplace

## Implementado
- Acesso por e-mail/senha, cadastro com nome privado, confirmação de e-mail, recuperação de senha e logout.
- Catálogo ilustrativo público e anúncios locais demonstrativos preservados.
- Favoritos privados (`wishlist`), separados das compras; nenhuma importação automática da sessão demo.
- Áreas distintas: Minha coleção, Minhas compras, Meus anúncios, Quero.
- Minha coleção lê somente `purchased_collection`; não há Tenho, Repetidos ou cadastro manual.
- `physical_copies` é inventário físico independente da coleção adquirida. Nenhuma operação de cadastro manual é exposta nesta etapa.
- `purchase_orders` e `purchased_collection` são preparação para vendas futuras, não um checkout. Somente escrita confiável pode criar pedidos ou aquisições; um trigger exige pedido recebido correspondente antes de aceitar uma aquisição.
- RLS e GRANTs em migrações versionadas: catálogo público somente leitura; perfil/favoritos privados; pedidos visíveis apenas aos participantes; coleção só ao dono.

## Configuração
Lovable Cloud conectado é o único destino desta etapa. E-mail/senha foi ativado sem alterar confirmação de e-mail. Não há configuração do banco próprio, conexão GitHub, pagamentos, lances ou publicação automática.
Em Cloud → Users → Auth Settings, mantenha confirmação de e-mail habilitada. Antes de publicar futuramente, confira os endereços de retorno permitidos para o domínio escolhido: origem para confirmação e `/reset-password` para recuperação. Não incluir chaves privadas em documentação ou no navegador.

## Demonstração e dados
Colecionadores fictícios e anúncios ilustrativos continuam somente locais. Novas contas começam sem compras, coleção e favoritos. Anúncios do formulário atual são demonstrativos de sessão, não anúncios reais ligados à conta e não aparecem como compras.
As tabelas da primeira implementação foram preservadas. A mudança de escopo acrescentou entidades de pedidos/aquisições, removeu as operações de coleção manual do aplicativo e não apagou registros reais.

## Futuro (não implementado)
Vendas diretas, leilões, pagamentos, lances, anúncios reais, entrega e confirmação de recebimento. O vendedor poderá registrar inventário próprio para anunciar sem adicioná-lo à coleção adquirida. A confirmação futura deverá ser autenticada e validada no servidor, com escrita de aquisição idempotente por pedido.

## Verificação
Resultados da execução são registrados abaixo após testar as telas, persistência de favoritos, acesso e isolamento. Entrega de e-mails numa caixa real depende do provedor e não pode ser inferida somente pelo sucesso da solicitação.