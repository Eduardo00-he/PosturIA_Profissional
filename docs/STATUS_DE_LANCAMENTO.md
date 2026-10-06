# PosturIA — status de lançamento e checklist de produção

**Conclusão atual: não publicar para venda nem armazenar dados de pacientes em produção ainda.** O trabalho nesta branch corrige vulnerabilidades e incoerências observadas no repositório, mas domínio e hospedagem, por si sós, não tornam o produto um sistema comercial operável.

## Correções aplicadas nesta branch

- Autenticação PosturIA usa a sessão Laravel, não credenciais fixas no JavaScript; o controlador legado com usuário/senha embutidos foi removido.
- Cadastro público foi desativado. Contas de clínica e médico são provisionadas por comando administrativo, com senha digitada em prompt oculto.
- Papel e vínculo com clínica/médico são derivados no servidor. APIs clínicas exigem sessão, CSRF e papel permitido; as consultas são limitadas ao tenant autorizado.
- Registros de clínica/médico/paciente de outro tenant retornam sem dados ou 404, em vez de confiar em IDs do navegador.
- Migrations aditivas associam contas a clínicas/médicos e permitem telemetria ausente sem presumir conexão/percentual.
- Dados antigos e históricos de demonstração não verificados deixam de ser apresentados como medições reais. Medições posturais registradas por profissional autenticado têm autoria e validação registradas.
- Dashboards e relatórios agregados incluem somente dados verificados e visíveis ao tenant autenticado; o histórico agregado usa uma requisição server-side, não uma requisição por paciente. A API não aceita alertas/status de IA marcados como verificados a partir do navegador.
- Seeders são não destrutivos, identificam dados como demonstração e recusam execução fora de `local`/`testing`.
- A vitrine identifica o PosturIA como protótipo em desenvolvimento, não disponível para compra; retira promessas de IA/WhatsApp não implementadas e mostra somente a stack web existente. Os preços de **R$ 600** e **R$ 800** são referências de planejamento, não oferta comercial.
- Checkout e formulário de CPF/endereço foram removidos enquanto não há criação real de pedido, gateway, frete e política comercial configurados. O site informa que não registra pedidos e oferece contato por e-mail.
- README e template de ambiente foram ajustados; a navegação superior/rodapé e os contatos passaram a ter destinos claros.

## Bloqueios que exigem trabalho/configuração externa

### 1. Integração do colete e origem dos dados — bloqueador funcional

Não há, neste repositório, uma API de ingestão autenticada para firmware/dispositivo, gestão de chaves do dispositivo, validação do protocolo, política de reenvio/offline ou monitoração da conexão do colete. O painel **não recebe telemetria real automaticamente**. Definir e implementar essa integração, testar com hardware e documentar calibração/faixas/unidades antes de prometer gráficos ao vivo, IA, alertas automáticos ou disponibilidade 24/7.

### 2. Checkout, pedido e logística — bloqueador comercial

Os preços são referências do projeto, não uma oferta de checkout pronta. Ainda é necessário escolher e integrar um gateway (criação de pedido, cobrança, webhooks idempotentes, estados de pagamento, conciliação, estorno/chargeback e recibos), definir estoque, frete/prazos, emissão fiscal, suporte, devolução/arrependimento, garantia e condições do produto. **Nenhum pedido/pagamento é recebido pela página atual.**

### 3. Privacidade, LGPD e segurança operacional — bloqueador para dados reais

Informações de saúde são dados pessoais sensíveis. Antes de cadastrar pacientes reais, definir controlador/operadores, finalidade e base legal adequada, minimização, aviso de privacidade, direitos do titular, retenção/eliminação, compartilhamento com clínica, logs/auditoria, resposta a incidentes, contratos e controles de acesso. Revisar com assessoria jurídica/de privacidade; este documento não é parecer legal.

### 4. Avaliação clínica e regulatória

Documentar finalidade pretendida, usuários, população, alegações, riscos e evidências clínicas. Determinar com especialista se o colete e/ou o software se enquadram como dispositivo médico/software como dispositivo médico e quais passos de regularização se aplicam no Brasil. Não anunciar diagnóstico, prevenção, eficácia, precisão ou benefício clínico sem evidência e revisão apropriadas.

### 5. Documentos e suporte ao consumidor

Publicar e revisar Política de Privacidade, Termos de Uso, informações completas da oferta e meios efetivos de atendimento antes de vender. Confirmar por escrito garantia, assistência, frete, prazo, disponibilidade, preço total e demais condições. Validar se os contatos já inseridos no código — e-mail, telefone e Instagram — estão ativos e sob controle da empresa.

### 6. Hospedagem e operações

- Hospedar em ambiente PHP/Laravel gerenciado, com document root apontando a `public/`; domínio e certificado HTTPS ativos.
- Configurar `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://...`, `SESSION_SECURE_COOKIE=true`, `SESSION_ENCRYPT=true`, `APP_KEY` forte e persistente, usuário MySQL de privilégio mínimo, credenciais fora do Git e backup/restauração testados.
- Configurar envio real de e-mail e testar login, redefinição de senha e alertas. `MAIL_MAILER=log` do exemplo é somente desenvolvimento e não entrega e-mails.
- Antes de migrations, fazer backup validado e ensaiar em staging com uma cópia anonimizada do schema/dados; aplicar `php artisan migrate --force` em janela controlada. **Não executar `db:seed` em produção.**
- As migrations `2026_10_06_190001` e `190002` abortam o rollback se houver valores nulos que seriam perdidos; `190003` aborta quando já existem registros marcados como verificados. Isso é uma proteção intencional contra perda/falseamento de dados: trate essas migrations como **forward-only depois que esses dados existirem**. Ensaiar um retorno compatível da aplicação/schema em staging e validar backup/restauração; não presumir que `migrate:rollback` funcionará após operação real.
- Gerar assets com `npm ci && npm run build`; fazer deploy atômico com retorno compatível com o schema, monitoramento de erros, saúde, disponibilidade, filas/cache se ativados e plano de resposta a incidentes.
- Fazer revisão de segurança independente, teste de autorização multi-tenant, revisão de dependências e teste de carga para o volume esperado.

### Escala das consultas

O gráfico agregado de relatórios foi consolidado em uma única consulta. Ainda assim, listas clínicas retornam coleções sem paginação; antes de uma clínica com volume real, implementar paginação/limites de data e executar teste de carga para o volume esperado.

## Provisionamento de conta

Após criar uma clínica e seus médicos de forma controlada no banco, um operador autorizado pode executar `php artisan posturia:user:create`. O comando exige vínculo existente e não publica cadastro aberto. Configure processo interno de revogação/transferência de contas, recuperação e rotação de senha antes de onboarding comercial.

## Fontes oficiais para revisão jurídica/regulatória

- [Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Anvisa — Software como Dispositivo Médico: perguntas e respostas](https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/produtos-para-a-saude/manuais/software-como-dispositivo-medico-perguntas-e-respostas)
- [Anvisa — Medical devices / regularização](https://www.gov.br/anvisa/en/regulation-of-products/medical-devices)
- [Decreto nº 7.962/2013 — contratação no comércio eletrônico](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm)

Verifique a redação e as orientações oficiais vigentes com profissionais habilitados antes do lançamento.
