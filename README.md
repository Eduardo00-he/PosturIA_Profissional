# PosturIA

Plataforma web Laravel + React/Inertia para um projeto de tecnologia vestível e acompanhamento postural. **O código não está liberado para venda/produção ainda**: autenticação e isolamento por clínica/médico foram reforçados, mas o checkout está deliberadamente desativado e a integração autenticada do colete ainda precisa ser implementada e validada.

## Requisitos

- PHP 8.3 (ou a versão compatível indicada em `composer.json`) com extensões Laravel/PDO correspondentes ao banco escolhido.
- Composer 2.
- Node.js 22 e npm.
- MySQL/MariaDB para um deployment típico; SQLite em memória é usado nos testes.

## Desenvolvimento local

```bash
cp .env.example .env
composer install
npm ci
php artisan key:generate
```

Configure um banco local MySQL/MariaDB e crie o schema definido em `.env`. Depois:

```bash
php artisan migrate
php artisan db:seed       # somente local/testing: cria dados fictícios sem apagar registros
php artisan serve
```

Em outro terminal:

```bash
npm run dev
```

O seeder principal e o seeder de demonstração recusam execução fora de `local`/`testing`. Não rode seeders em produção.

## Contas PosturIA

O cadastro público está desativado. Uma conta precisa ser provisionada por operador autorizado:

```bash
php artisan posturia:user:create
```

O comando solicita perfil (clínica/médico), nome, e-mail, ID da clínica, vínculo com médico quando aplicável e senha por prompt oculto. O provisionamento, a troca e a redefinição por e-mail exigem pelo menos 12 caracteres. Use o ID de uma clínica/médico existente; entregue a senha inicial ao titular por canal seguro e peça a troca no primeiro acesso.

- Uma conta de clínica tem acesso aos médicos e pacientes vinculados àquela clínica.
- Uma conta de médico tem acesso apenas ao registro profissional e aos pacientes daquele médico.
- A autorização é verificada no servidor; parâmetros enviados pelo navegador não escolhem papel, clínica ou médico.

## Testes e build

```bash
APP_ENV=testing php artisan test
npm run build
```

Os testes usam `phpunit.xml`, com SQLite em memória e uma `APP_KEY` exclusiva de testes. O prefixo `APP_ENV=testing` evita que um `APP_ENV` herdado do terminal/CI mantenha o processo em produção durante os testes.

## Estado de dados e telemetria

Dados antigos e registros de demonstração são marcados como não verificados e não aparecem como telemetria real. Medições adicionadas por um profissional autenticado ficam auditadas; **a ingestão autenticada do firmware/colete ainda não existe**. Não interprete o indicador “sem telemetria” como estado offline.

## Lançamento

Antes de configurar domínio/hosting e abrir vendas, siga o [checklist de prontidão de produção](docs/STATUS_DE_LANCAMENTO.md). Ele lista a configuração segura, migrações, pagamentos, logística, LGPD, validação clínica/regulatória e integração de hardware que ainda faltam.
