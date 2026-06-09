# NodeAuthApi

API completa de autenticação desenvolvida com Node.js, Express e MySQL, criada com foco em portfólio para demonstrar conhecimentos em autenticação, segurança de aplicações web, gerenciamento de sessões e integração com provedores externos.

---

## Sobre o Projeto

O NodeAuthApi é uma solução de autenticação moderna que implementa múltiplas camadas de segurança, incluindo autenticação local, login social com Google OAuth 2.0, autenticação em dois fatores (2FA), recuperação de senha, bloqueio de contas por tentativas inválidas, auditoria de eventos e gerenciamento persistente de sessões.

O objetivo principal do projeto é demonstrar a construção de uma API robusta utilizando boas práticas de arquitetura, organização de código e segurança.

---

## Demonstração das Funcionalidades

### Cadastro de Usuário

- Cadastro utilizando nome, e-mail e senha.
- Validação de dados com Express Validator.
- Senhas armazenadas utilizando hash Bcrypt.
- Conta criada inicialmente como inativa.
- Envio automático de token de ativação por e-mail.

### Ativação de Conta

- Ativação via token enviado por e-mail.
- Controle de expiração do token.
- Reenvio de token de ativação.

### Login Local

- Login utilizando e-mail e senha.
- Controle de tentativas inválidas.
- Bloqueio automático após 5 tentativas incorretas.

### Login Social

- Integração com Google OAuth 2.0.
- Login utilizando conta Google.
- Vinculação automática entre conta local e conta Google.

### Autenticação em Dois Fatores (2FA)

Após o login:

- Código enviado por e-mail.
- Sessão temporária criada durante a validação.
- Login concluído apenas após confirmação do código.

### Recuperação de Senha

- Solicitação de redefinição via e-mail.
- Token temporário para redefinição.
- Controle de expiração.

### Desbloqueio de Conta

- Solicitação de desbloqueio via e-mail.
- Token temporário para desbloqueio.
- Limpeza automática do contador de tentativas.

### Histórico de Senhas

- Registro das alterações de senha.
- Impede reutilização de senhas anteriores.

### Gerenciamento de Sessões

- Persistência de sessões no banco de dados.
- Identificação de IP.
- Identificação de navegador.
- Controle de expiração.
- Logout seguro.
- Renovação automática da sessão durante utilização.

### Limpeza Automática de Sessões

Job responsável por:

- Localizar sessões expiradas.
- Invalidar sessões abandonadas.
- Manter consistência do sistema.

### Dashboard do Usuário

Área protegida acessível apenas por usuários autenticados.

Informações disponíveis:

- Nome
- E-mail
- Provider utilizado
- Status da conta
- Sessões ativas
- Histórico de senhas
- Logs de atividade
- Navegador utilizado
- Sistema operacional
- Expiração da sessão atual

### Configurações da Conta

Usuário autenticado pode:

- Alterar nome.
- Alterar senha.
- Excluir conta permanentemente.

---

## Fluxo de Autenticação

### Cadastro

1. Usuário realiza cadastro.
2. Conta é criada como inativa.
3. Token de ativação é enviado por e-mail.
4. Usuário ativa a conta através do link recebido.

### Login Local

1. Usuário informa e-mail e senha.
2. Sistema valida as credenciais.
3. Sessão temporária é criada.
4. Código 2FA é enviado por e-mail.
5. Usuário valida o código.
6. Sessão definitiva é criada.

### Login Google

1. Usuário autentica via Google OAuth.
2. Sistema verifica a existência da conta.
3. Caso necessário, vincula a conta local ao Google.
4. Sessão autenticada é criada.

### Recuperação de Senha

1. Usuário solicita recuperação.
2. Token é enviado por e-mail.
3. Usuário redefine a senha.
4. Histórico de senhas é atualizado.

---

## Tecnologias Utilizadas

### Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- Express Session
- Passport.js
- Google OAuth 2.0
- Nodemailer
- Bcrypt
- Express Validator
- UA Parser JS

### Banco de Dados

- MySQL

### ORM

- Sequelize

---

## Estrutura do Projeto

```txt
node-auth-api
│
├── src
│   ├── config
│   ├── controller
│   ├── database
│   ├── jobs
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── service
│   ├── templates
│   ├── utils
│   └── app.js
│
├── server.js
├── .env
├── package.json
└── README.md
```

---

## Estrutura do Banco de Dados

### Users

Tabela principal responsável pelo armazenamento dos usuários.

Campos relevantes:

- id
- name
- email
- password
- provider
- googleId
- isActive
- isBlocked
- activationToken
- tokenExpires
- twoFactorCode
- twoFactorCodeExpires
- unlockToken
- unlockTokenExpires
- resetPassToken
- resetPassTokenExpires

### Password Histories

Responsável pelo histórico de senhas utilizadas pelo usuário.

### User Sessions

Responsável pela persistência das sessões.

Informações armazenadas:

- Session ID
- IP de acesso
- Navegador
- Status da sessão
- Data de expiração

### User Logs

Responsável pela auditoria do sistema.

Eventos registrados:

- Conta criada
- Conta ativada
- Login realizado
- Alteração de senha
- Conta bloqueada
- Conta desbloqueada
- Exclusão de conta

---

## Sistema de Auditoria

A API registra automaticamente eventos relevantes para fins de rastreabilidade e segurança.

Exemplos:

- Conta criada
- Conta ativada
- Login realizado
- Alteração de senha
- Alteração de nome
- Conta bloqueada
- Conta desbloqueada
- Exclusão de conta

Todos os registros ficam disponíveis para consulta através do dashboard autenticado.

---

## Endpoints

### Autenticação

| Método | Endpoint |
|----------|----------|
| POST | /auth/register |
| POST | /auth/login |
| POST | /auth/logout |

### Ativação de Conta

| Método | Endpoint |
|----------|----------|
| GET | /auth/activate-account |
| POST | /auth/resend |

### Autenticação em Dois Fatores

| Método | Endpoint |
|----------|----------|
| POST | /auth/verify-2fa |
| POST | /auth/resend-2fa |

### Recuperação de Senha

| Método | Endpoint |
|----------|----------|
| POST | /auth/forgot-password |
| POST | /auth/reset-password |

### Desbloqueio de Conta

| Método | Endpoint |
|----------|----------|
| POST | /auth/unlockAccount |
| GET | /auth/unlockAccount |

### Dashboard

| Método | Endpoint |
|----------|----------|
| GET | /auth/me |

### Preferências do Usuário

| Método | Endpoint |
|----------|----------|
| PUT | /auth/change-name |
| PUT | /auth/change-password |
| DELETE | /auth/delete-account |

### Google OAuth

| Método | Endpoint |
|----------|----------|
| GET | /auth/google |
| GET | /auth/callback |

---

## Segurança Implementada

- Hash de senhas utilizando Bcrypt.
- Autenticação em dois fatores (2FA).
- Google OAuth 2.0.
- Tokens temporários para operações críticas.
- Controle de tentativas inválidas.
- Bloqueio automático de contas.
- Persistência de sessões.
- Expiração automática de sessões.
- Auditoria de eventos.
- Middleware de proteção para rotas privadas.

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Zero-Absolut/node-auth-api.git
```

Entre no diretório:

```bash
cd node-auth-api
```

Instale as dependências:

```bash
npm install
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
PORT=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

SESSION_SECRET=

EMAIL_USER=
EMAIL_PASS=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Executando o Projeto

Modo desenvolvimento:

```bash
nodemon server.js
```

ou

```bash
node server.js
```

---

## Repositórios

### Backend

https://github.com/Zero-Absolut/node-auth-api

### Frontend

https://github.com/Zero-Absolut/node-auth-frontend

---

## Roadmap

Funcionalidades planejadas para futuras versões:

- [ ] Documentação Swagger/OpenAPI
- [ ] Docker
- [ ] Testes automatizados
- [ ] Rate Limiting
- [ ] Refresh Tokens
- [ ] Deploy em ambiente cloud

---

## Autor MATEUS BRITO

**Mateus Felipe**

Projeto desenvolvido com foco em estudo avançado de autenticação, segurança de aplicações web e construção de portfólio profissional.
