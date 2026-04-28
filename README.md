# 🔐 Authentication API

API de autenticação completa desenvolvida com foco em segurança, escalabilidade e boas práticas de backend.

---

## 📌 Sobre o projeto

Esta API foi criada para gerenciar autenticação de usuários, incluindo cadastro, ativação de conta via email e futuras implementações como autenticação em dois fatores (2FA), login social e gerenciamento completo de perfil.

---

## 🚀 Funcionalidades

### ✅ Implementado

* Cadastro de usuário
* Criptografia de senha
* Geração de token de ativação
* Envio de email para confirmação de conta
* Validação de conta via token

### 🚧 Em desenvolvimento

* Login de usuário
* Autenticação com 2FA
* Login social (Google, etc.)
* Gerenciamento de perfil (endereço, contato, dados pessoais)
* Sessões e controle de autenticação

---

## 🛠️ Tecnologias utilizadas

* Node.js
* Express
* MySQL
* JWT (JSON Web Token)
* Nodemailer
* dotenv

---

## 🔐 Segurança

* Senhas criptografadas com hash (bcrypt)
* Tokens únicos para ativação de conta
* Variáveis sensíveis protegidas com `.env`
* Estrutura preparada para autenticação com JWT e 2FA

---

## ▶️ Como executar o projeto

```bash
git clone https://github.com/Zero-Absolut/NOME-DO-REPO.git
cd NOME-DO-REPO
npm install
npm run dev
```

---

## ⚙️ Variáveis de ambiente

Este projeto utiliza o pacote **dotenv** para gerenciar variáveis de ambiente.

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco

JWT_SECRET=sua_chave_secreta

EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
```

---

## 📡 Endpoints principais

### 📌 Cadastro

```http
POST /register
```

### 📌 Ativação de conta

```http
GET /activate/:token
```

---

## 📈 Objetivo do projeto

Este projeto faz parte do meu portfólio como desenvolvedor backend, com foco em construção de APIs reais, seguras e escaláveis.

---

## 📌 Status

🚧 Em desenvolvimento

---

## 👨‍💻 Autor

Mateus Brito
🔗 https://github.com/Zero-Absolut
