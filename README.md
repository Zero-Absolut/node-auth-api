# 🔐 Node Auth API

API de autenticação completa desenvolvida com foco em segurança, arquitetura desacoplada e boas práticas de backend moderno.

---

## 📌 Sobre o projeto

A Node Auth API é uma solução de autenticação construída com Node.js e Express, desenvolvida para simular fluxos reais de autenticação utilizados em aplicações modernas.

O projeto possui integração completa com frontend desacoplado, sistema de ativação de conta por e-mail, autenticação em duas etapas (2FA), gerenciamento de sessões temporárias e tratamento robusto de erros.

---

## 🌐 Frontend da aplicação

O frontend desacoplado responsável pelo consumo desta API pode ser acessado no repositório abaixo:

🔗 https://github.com/Zero-Absolut/node-auth-frontend

---

## 🚀 Funcionalidades

### ✅ Implementado

- Cadastro de usuários
- Login com autenticação segura
- Criptografia de senha com bcrypt
- Ativação de conta por token enviado por e-mail
- Reenvio de token de ativação
- Validação de tokens expirados
- Autenticação em duas etapas (2FA)
- Reenvio de código 2FA
- Sessões temporárias para fluxos de autenticação
- Integração frontend ↔ backend com Axios
- Tratamento padronizado de erros
- Validações robustas com express-validator
- Arquitetura organizada em:
  - Controllers
  - Services
  - Middlewares
  - Utils

---

## 🚧 Em desenvolvimento

- Login social com Google
- Proteção avançada da API
- Rate Limiting
- Recuperação de senha
- Dashboard autenticada
- Gerenciamento completo de perfil
- Sistema de logs para monitoramento e captura de erros da aplicação

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- MySQL
- Sequelize
- bcrypt
- express-session
- express-validator
- Nodemailer
- Google Auth Library
- dotenv
- CORS

---

## 📦 Dependências principais

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "express-session": "^1.19.0",
  "express-validator": "^7.3.2",
  "google-auth-library": "^10.6.2",
  "mysql2": "^3.22.3",
  "nodemailer": "^8.0.5",
  "nodemon": "^3.1.14",
  "sequelize": "^6.37.8"
}
```

---

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Tokens únicos para ativação de conta
- Expiração automática de tokens
- Sessões temporárias para autenticação parcial
- Estrutura preparada para proteção avançada da API
- Variáveis sensíveis protegidas com `.env`

---

## ▶️ Como executar o projeto

```bash
git clone https://github.com/Zero-Absolut/node-auth-api.git

cd node-auth-api

npm install

npm run dev
```

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=8080

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco

SESSION_SECRET=sua_chave_secreta

EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
```

---

## 📡 Principais endpoints

### 📌 Cadastro

```http
POST /api/auth/register
```

### 📌 Login

```http
POST /api/auth/login
```

### 📌 Ativação de conta

```http
GET /api/auth/activate-account
```

### 📌 Reenvio de token

```http
POST /api/auth/resend
```

### 📌 Verificação 2FA

```http
POST /api/auth/verify-2fa
```

### 📌 Reenvio código 2FA

```http
POST /api/auth/resend-2fa
```

---

## 🧠 Arquitetura

O projeto utiliza uma arquitetura desacoplada entre frontend e backend, permitindo integração com diferentes clientes (web, mobile, SPA, etc).

A API foi construída com foco em:
- Escalabilidade
- Organização
- Segurança
- Separação de responsabilidades

---

## 📈 Objetivo do projeto

Este projeto faz parte do meu portfólio como desenvolvedor backend/full stack e tem como objetivo demonstrar a construção de um sistema de autenticação real, utilizando boas práticas modernas de desenvolvimento.

---

## 📌 Status

✅ Funcional  
🚧 Em evolução contínua

---

## 👨‍💻 Autor

Mateus Brito

🔗 https://github.com/Zero-Absolut
