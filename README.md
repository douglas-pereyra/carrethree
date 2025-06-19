
# Online Supermarket - Carrethree

Bem-vindo ao **Carrethree**, um projeto de supermercado online completo, desenvolvido como parte de um trabalho acadêmico. Esta aplicação **full-stack** simula uma experiência de e-commerce real, com funcionalidades tanto para clientes quanto para administradores.

---

## 🧑‍🤝‍🧑 Identificação do Grupo

**Grupo:** 8

**Integrantes:**
- Douglas da Fontoura Pereyra (NUSP: 14566686)
- Henrique Vilela Zucoloto (NUSP: 14578515)
- Nicolas Carreiro Rodrigues (NUSP: 14600801)

---

## 🛒 Funcionalidades Implementadas

### Para Clientes

- **Visualização de Produtos**: Navegação por uma lista de produtos com busca por palavra-chave e filtro por categorias.
- **Carrinho de Compras Híbrido**: Usuários podem montar um carrinho como "convidado" (salvo no `localStorage`) que é automaticamente fundido com seu carrinho no banco de dados após o login.
- **Autenticação de Usuário**: Sistema completo de cadastro e login.
- **Páginas Protegidas**: Rotas como "Minha Conta" e "Checkout" são acessíveis apenas para usuários logados.
- **Fluxo de Checkout**: Formulário de finalização de compra com validação e resumo do pedido.

### Para Administradores

- **Painel de Controle Seguro**: Acesso a um painel de gerenciamento exclusivo para administradores.
- **CRUD de Produtos**: Funcionalidade completa para Criar, Ler, Atualizar e Deletar produtos.
- **Upload de Imagens**: Suporte para upload de novas imagens ao criar ou editar produtos.
- **Dashboard de Gerenciamento**: Visualização de todos os produtos cadastrados com opções de edição e exclusão rápida.

---

## 🧱 Tech Stack (Tecnologias Utilizadas)

O projeto foi construído utilizando uma arquitetura moderna com separação entre **backend** e **frontend**.

### Backend

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework para a construção da API RESTful.
- **MongoDB**: Banco de dados NoSQL para armazenar os dados de usuários, produtos e carrinhos.
- **Mongoose**: ODM para modelar e interagir com os dados do MongoDB.
- **JSON Web Tokens (JWT)**: Para garantir a segurança e autenticação nas rotas da API.
- **Multer**: Middleware para lidar com o upload de arquivos (imagens dos produtos).
- **Dotenv**: Para gerenciamento de variáveis de ambiente.

### Frontend

- **React.js**: Biblioteca para a construção da interface de usuário.
- **Vite**: Ferramenta de build e servidor de desenvolvimento de alta performance.
- **React Router**: Para gerenciamento de rotas e navegação na SPA.
- **Context API & Hooks**: Para gerenciamento de estado global de forma moderna e centralizada (Autenticação, Produtos e Carrinho).
- **CSS**: Estilização pura com foco em responsividade (Flexbox e Grid).

---

## 🧪 Guia de Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Pré-requisitos

- Node.js (versão LTS recomendada)
- npm (já vem instalado com o Node.js)
- MongoDB (uma instância local ou uma conta gratuita no MongoDB Atlas)

### 2. Instalação

Clone o repositório para a sua máquina:

```bash
git clone https://github.com/douglas-pereyra/carrethree.git
cd carrethree
```

Como o projeto é um **monorepo** (contém backend e frontend), você precisa instalar as dependências em ambas as pastas.

#### a) Instalar dependências do Frontend:

Na pasta raiz (`OnlineStore`), execute:

```bash
npm install
```

#### b) Instalar dependências do Backend:

Navegue para a pasta do backend e instale suas dependências:

```bash
cd backend
npm install
```

---

### 3. Configuração de Variáveis de Ambiente

O backend precisa de um arquivo `.env` para armazenar as credenciais do banco de dados e outros segredos.

Dentro da pasta `backend`, crie um arquivo chamado `.env`.

Cole o seguinte conteúdo:

```env
# URI de conexão do seu banco de dados MongoDB (local ou do Atlas)
MONGO_URI=mongodb+srv://<seu-usuario>:<sua-senha>@seu-cluster.mongodb.net/sua-database?retryWrites=true&w=majority

# Segredo para gerar os tokens JWT (pode ser qualquer string segura)
JWT_SECRET=este-e-um-segredo-muito-seguro-troque-por-outro

# Porta em que o servidor backend vai rodar
PORT=5000

# URL base do backend (usada para construir os links das imagens)
BACKEND_URL=http://localhost:5000
```

> ⚠️ **Importante**: Substitua os valores de `MONGO_URI` pelas suas próprias credenciais. Nunca envie o arquivo `.env` para repositórios públicos.

---

### 4. Popular o Banco de Dados (Seeding)

Para adicionar produtos e usuários administradores para teste, execute o script de seeding:

```bash
npm run data:import
```

Isso irá limpar e popular as coleções de produtos e usuários.

---

### 5. Executando a Aplicação

Você precisará de **dois terminais abertos**.

#### a) Terminal 1 (Backend):

Navegue até a pasta do backend e inicie o servidor:

```bash
cd backend
npm start
```

Você deverá ver a mensagem:  
**🚀 Servidor backend rodando na porta 5000.**

#### b) Terminal 2 (Frontend):

Na pasta raiz do projeto (`OnlineStore`), inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

Você deverá ver uma mensagem indicando que a aplicação está disponível, geralmente em `http://localhost:5173`.

Abra essa URL no seu navegador.

---

## ✅ Pronto!

A aplicação completa está rodando na sua máquina! 🎉
