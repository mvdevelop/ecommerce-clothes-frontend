
## 👕 E-Commerce Clothes Frontend

Uma plataforma de e-commerce de moda com design moderno dark theme e acentos rosa. Construída com **React + TypeScript**, a aplicação oferece uma experiência de compra fluida com carrinho interativo, landing page animada e total responsividade.

## 🚀 Funcionalidades

- **Catálogo de Produtos:** Exibição dinâmica de roupas com filtros por categoria (Men, Women, Kids).
- **Carrinho de Compras Interativo:** Adicione, remova e gerencie a quantidade de itens com cálculo em tempo real.
- **Visualização Detalhada:** Páginas exclusivas para cada produto com especificações e imagens.
- **Autenticação Simulada:** Sistema de login/signup funcional com backend mock.
- **Landing Page Premium:** Seções animadas (Hero, Features, Testimonials, CTA) com design dark theme.
- **Animações Suaves:** Transições spring com Framer Motion.
- **Notificações Toast:** Feedback visual para ações (adicionar/remover do carrinho, login, logout).
- **Totalmente Responsivo:** Experiência otimizada para mobile, tablet e desktop.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|---|---|---|
| React | 18 | Biblioteca principal |
| TypeScript | 4.9 | Tipagem estática |
| Tailwind CSS | 3 | Estilização utilitária |
| Redux Toolkit | 2 | Gerenciamento de estado global |
| Framer Motion | 11 | Animações spring |
| React Router DOM | 7 | Rotas e navegação |
| Lucide React | — | Conjunto de ícones |
| React Toastify | 11 | Notificações toast |
| Swiper | 12 | Carrosséis de produtos |
| json-server (mock) | — | API REST mockada |

## 📦 Como rodar o projeto

### Pré-requisitos
- Node.js 16+
- npm 8+

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/mvdevelop/ecommerce-clothes-frontend.git
cd ecommerce-clothes-frontend

# Instale as dependências
npm install

# Inicie o mock server + React app simultaneamente
npm run dev
```

O **mock server** roda em `http://localhost:4000` e o **frontend** em `http://localhost:3000`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia mock server + React app (concorrente) |
| `npm start` | Inicia apenas o React app |
| `npm run mock-server` | Inicia apenas o mock server (porta 4000) |
| `npm run build` | Gera build de produção |
| `npm test` | Executa testes |
| `npx tsc --noEmit` | Verifica tipos TypeScript |

### Mock Server

O projeto inclui um servidor mock em `server.js` que fornece:

- **`GET /allproducts`** — Lista de todos os produtos
- **`GET /popularinwomen`** — Produtos populares
- **`GET /newcollections`** — Novas coleções
- **`POST /signup`** — Cadastro de usuário
- **`POST /login`** — Login de usuário
- **`POST /getcart`** — Obter carrinho do usuário (requer auth-token)
- **`POST /addtocart`** — Adicionar item ao carrinho
- **`POST /removefromcart`** — Remover item do carrinho

> Credenciais de teste: `test@test.com` / `123456`

## 📂 Estrutura de Pastas

```
ecommerce-clothes-frontend/
├── public/                    # Arquivos estáticos
├── src/
│   ├── assets/                # Imagens (produtos, banners, ícones)
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Navbar.tsx         # Navbar com menu mobile
│   │   ├── Footer.tsx         # Footer com links e redes sociais
│   │   ├── Item.tsx           # Card de produto
│   │   ├── ProductDisplay.tsx # Exibição detalhada do produto
│   │   ├── CartItems.tsx      # Itens do carrinho
│   │   ├── ProductSlider.tsx  # Carrossel com Swiper
│   │   ├── SectionTitle.tsx   # Título de seção animado
│   │   ├── Breadcrum.tsx      # Navegação breadcrumb
│   │   └── ...                # Demais componentes
│   ├── sections/              # Seções da landing page
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TestimonialSection.tsx
│   │   └── CTASection.tsx
│   ├── context/               # Contexto (ShopContext)
│   │   └── ShopContext.tsx
│   ├── store/                 # Redux Toolkit
│   │   ├── index.ts           # Configuração da store
│   │   ├── hooks.ts           # Hooks tipados
│   │   └── slices/
│   │       ├── cartSlice.ts   # Estado do carrinho
│   │       ├── productsSlice.ts # Estado dos produtos
│   │       └── authSlice.ts   # Estado de autenticação
│   ├── services/
│   │   └── toastService.ts    # Helpers de notificação
│   ├── types/
│   │   ├── index.ts           # Tipos globais (Product, CartItems, etc.)
│   │   └── assets.d.ts        # Declarações de módulos (imagens, CSS)
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Shop.tsx           # Landing page principal
│   │   ├── ShopCategory.tsx   # Listagem por categoria
│   │   ├── Product.tsx        # Detalhe do produto
│   │   ├── Cart.tsx           # Carrinho de compras
│   │   └── LoginSignup.tsx    # Login / Cadastro
│   ├── App.tsx                # Rotas e estrutura raiz
│   ├── index.tsx              # Entry point (Provider + Redux + Context)
│   └── index.css              # Estilos globais (Tailwind + fonte Poppins)
├── server.js                  # Mock REST API (express/json-server)
├── db.json                    # Dados mockados
├── tailwind.config.js         # Configuração do Tailwind
├── tsconfig.json              # Configuração do TypeScript
└── package.json
```

## 🎨 Design System

O projeto utiliza um tema escuro personalizado:

| Token | Valor |
|---|---|
| Background | `#000` (preto) |
| Cards | `bg-slate-950` + `border-slate-800` |
| Texto primário | `text-white` |
| Texto secundário | `text-slate-300/400` |
| Accent | `pink-600` (#db2777) |
| Hover accent | `pink-700` |
| Fonte | Poppins (Google Fonts) |
| Animações | Framer Motion spring (stiffness 240-320) |

## 🧪 Testes

```bash
npm test
```

## 👨‍💻 Autor

Desenvolvido com ❤️ por **mvdevelop**.

- GitHub: [@mvdevelop](https://github.com/mvdevelop)

## 📄 Licença

Este projeto está sob a licença MIT.
