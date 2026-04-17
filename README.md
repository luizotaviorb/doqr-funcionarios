# Controle de Funcionários — DoQR Tecnologia

Sistema de gerenciamento de funcionários desenvolvido como avaliação técnica frontend para a DoQR Tecnologia.

## 🚀 Tecnologias

- **Next.js 16** com App Router e TypeScript
- **TailwindCSS v4** com design system customizado
- **shadcn/ui** (preset Nova) para componentes de interface
- **React Hook Form** + **Zod** para formulários e validação
- **Sonner** para notificações toast
- **Cypress** para testes E2E

## 📋 Funcionalidades

- Listagem de funcionários com busca por nome (debounce de 400ms)
- Cadastro de novo funcionário com validação em tempo real
- Edição de funcionário existente
- Exclusão com dialog de confirmação
- Máscaras de entrada para CPF, celular e data de nascimento
- Renderização inicial via SSR (Server Side Rendering)
- Loading state com skeleton enquanto os dados carregam
- Feedback visual com toasts de sucesso e erro

## 🔗 API

A aplicação consome a API REST disponível em:

https://api-testefrontend.qforms.com.br

Documentação Swagger:

https://api-testefrontend.qforms.com.br/swagger/index.html

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/luizotaviorb/doqr-funcionarios

# Entre na pasta do projeto
cd doqr-funcionarios

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de produção

```bash
# Gerar o build
npm run build

# Rodar em modo produção
npm start
```

## 🧪 Testes E2E com Cypress

Os testes cobrem os fluxos principais da aplicação: listagem, navegação, cadastro, edição e exclusão de funcionários.

### Pré-requisito

A aplicação precisa estar rodando localmente antes de executar os testes, por isso execute dois terminais diferentes:

```bash
npm run dev
```

### Abrindo o Cypress (modo interativo)

```bash
npm run cypress:open
```

Selecione **E2E Testing** → escolha o browser → clique em `funcionarios.cy.ts` para rodar os testes.

### Rodando os testes no terminal (modo headless)

```bash
npm run cypress:run
```

## 📁 Estrutura do projeto

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx                      # Layout raiz com fonte Inter e Toaster
│   └── funcionarios/
│       ├── page.tsx                    # Server Component — listagem via SSR
│       ├── error.tsx                   # Tratamento de erro (App Router)
│       ├── loading.tsx                 # Skeleton de loading (App Router)
│       ├── [id]/
│       │   └── page.tsx                # Tela de edição de funcionário
│       └── novo/
│           └── page.tsx                # Tela de cadastro de funcionário
├── components/
│   ├── funcionarios/
│   │   ├── DeleteDialog.tsx            # Dialog de confirmação de exclusão
│   │   ├── EditarFuncionarioForm.tsx   # Client Component da edição de funcionário existente
│   │   ├── FuncionariosClient.tsx      # Client Component da listagem
│   │   ├── FuncionariosTable.tsx       # Tabela de funcionários
│   │   ├── NovoFuncionarioForm.tsx     # Client Component da criação de novo funcionário
│   │   └── StatusBadge.tsx             # Badge de status Ativo/Inativo
│   ├── icons/
│   │   ├── IconArrowLeft.tsx           # Ícone de voltar
│   │   └── IconPlus.tsx                # Ícone de adicionar
│   ├── layout/
│   │   └── Navbar.tsx                  # Barra de navegação
│   └── ui/                             # Componentes shadcn/ui
├── hooks/
│   └── useFuncionarios.ts              # Hook de listagem com busca e debounce
├── lib/
│   ├── api.ts                          # Cliente HTTP com tratamento de erros
│   └── utils.ts                        # Utilitários de formatação (CPF, celular, data)
├── schemas/
│   └── funcionario.schema.ts           # Schema Zod de validação
└── types/
    └── funcionario.ts                  # Tipos TypeScript da entidade
```

## 📈 Próximos passos e Escalabilidade

Em um cenário de maior escala ou em produção, refatoraria os formulários para adotar **Server Actions**, consolidando a lógica de mutação no servidor e eliminando as chamadas fetch client-side. A estrutura atual de **Server Components** nas pages já prepara o projeto para essa migração de forma natural.

## 💡 Decisões técnicas

**SSR em todas as páginas** — Todas as rotas são Server Components por padrão. A listagem busca os dados via `employeeApi.getAll()` e a tela de edição via `employeeApi.getById()`, repassando os dados para client components responsáveis pela interatividade. Isso garante que o HTML já chegue renderizado ao cliente, melhorando performance e eliminando loading states desnecessários.

**Design system centralizado** — Todas as cores, tipografia e espaçamentos do Figma foram mapeados como variáveis CSS no `globals.css`, seguindo a convenção do TailwindCSS v4 e shadcn/ui. Isso garante consistência visual e facilita manutenção.

**Validação com Zod + refine** — O campo de data de nascimento utiliza `.refine()` para validar se a data realmente existe (ex: rejeita 31/02/2000), além das validações básicas de formato.

**Máscaras com controle de backspace** — As funções de máscara (CPF, celular, data) recebem o valor anterior como parâmetro para detectar quando o usuário está apagando, evitando o comportamento indesejado de reforçar a máscara durante a exclusão de caractere.

**Debounce na busca** — Implementei um atraso de 400ms (debounce) dentro do hook `useFuncionarios` na busca por nome, evitando que o site trave ou faça dezenas de chamadas inúteis à API.

**Sobrescrita de estilos do shadcn/ui** — O componente de tabela do shadcn injeta classes como `px-2` e `p-2` diretamente no HTML, o que impede a aplicação do design system via CSS customizado. Para resolver, usei `!important` de forma pontual e centralizada no `globals.css`, nas classes `.table-header-cell`, `.table-cell`, `.cell-action` e no seletor `[data-sonner-toast]` para padronizar a fonte dos toasts.
