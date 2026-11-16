# Locked Unit — Design System & Portal Oficial

Portal oficial e repositório de Design System do jogo **Locked Unit: Escape Room Horror**, desenvolvido pela **Pingado Studios** no Centro Universitário Senac Santo Amaro (4º Semestre de Jogos Digitais).

---

## 🌐 Links do Projeto

- **Site Oficial (GitHub Pages):** [https://lariikimie.github.io/Locked-Unit-Design-System/](https://lariikimie.github.io/Locked-Unit-Design-System/)
- **Painel Administrativo CMS (Restrito):** [https://lariikimie.github.io/Locked-Unit-Design-System/admin/](https://lariikimie.github.io/Locked-Unit-Design-System/admin/)
- **Repositório GitHub:** [https://github.com/Lariikimie/Locked-Unit-Design-System](https://github.com/Lariikimie/Locked-Unit-Design-System)

---

## 📁 Estrutura de Arquivos

```text
Locked-Unit-Design-System/
├── index.html              # Início: Hero, pilares e atmosfera
├── locked-unit.html        # O Jogo: Sinopse, personagens e Vertical Slice (Fases 1 e 2)
├── design-system.html      # Design System: Tokens com cópia Hex, tipografia, verbos e acessibilidade
├── media-kit.html          # Mídia Kit: Releases copiáveis, ficha técnica e downloads de logos
├── sobre.html              # Sobre o Estúdio: História do café pingado, Larissa, Helen, orientadoras e ODS
├── .nojekyll               # Desativa Jekyll no GitHub Pages para carregar todos os diretórios
├── admin/
│   ├── index.html          # Sveltia CMS (Editor visual carregado via CDN unpkg)
│   └── config.yml          # Configuração das 7 coleções do CMS e autenticação por token
├── assets/
│   ├── css/style.css       # Folha de estilo industrial/dark com tokens variáveis
│   ├── js/app.js           # Funções de cópia de tokens, toasts e scroll spy
│   └── img/
│       ├── logo-pingado.png
│       ├── logo-locked-unit.png
│       └── uploads/        # Diretório destinado para upload de prints e artes
└── content/
    ├── marca.json          # Identidade e pilares editáveis
    ├── tom-de-voz.json     # Matriz de vozes e glossário de microcópia
    ├── tokens.json         # Tokens de cores (incluindo o Genius) e fontes
    ├── verbos-efeitos.json # 15 verbos e efeitos táteis (Juice) do core loop
    ├── acessibilidade.json # Recursos de conforto implementados no Unity
    ├── media-kit.json      # Ficha técnica, sinopses e dados de imprensa
    └── sobre.json          # Textos institucionais da Pingado Studios
```

---

## 🚀 Como Fazer o Primeiro Envio (Push) para o GitHub

Abra o terminal PowerShell na pasta deste repositório e execute os comandos abaixo:

```powershell
cd "C:\Users\laris\OneDrive\Área de Trabalho\4 Semestre\Locked-Unit-Design-System"

# 1. Inicializar o repositório Git local
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Criar o commit inicial
git commit -m "feat: lancamento do portal locked unit, design system, midia kit e sveltia cms"

# 4. Definir a branch principal como main
git branch -M main

# 5. Conectar ao repositório remoto do GitHub
git remote add origin https://github.com/Lariikimie/Locked-Unit-Design-System.git

# 6. Enviar os arquivos para o GitHub
git push -u origin main
```

*(Caso o repositório remoto no GitHub já tenha sido criado com um README ou licença vazia, utilize `git push -u origin main --force`)*.

---

## ⚙️ Ativando o GitHub Pages (Publicação Gratuita)

1. No seu navegador, acesse o repositório: [https://github.com/Lariikimie/Locked-Unit-Design-System](https://github.com/Lariikimie/Locked-Unit-Design-System)
2. Clique na aba superior **Settings** (Configurações).
3. Na barra lateral esquerda, clique em **Pages**.
4. Em **Build and deployment > Source**, selecione **Deploy from a branch**.
5. Em **Branch**, selecione `main` e a pasta `/(root)`, e clique em **Save**.
6. Aguarde cerca de 1 a 2 minutos. O site estará publicado em:
   👉 **`https://lariikimie.github.io/Locked-Unit-Design-System/`**

---

## 👥 Convidando Helen como Colaboradora do Repositório

Para que Helen consiga acessar o `/admin/` e editar conteúdos:
1. No repositório no GitHub, clique em **Settings**.
2. Na barra lateral esquerda, clique em **Collaborators**.
3. Clique no botão verde **Add people**.
4. Digite o usuário do GitHub da Helen (`helenrayssaalves` ou o e-mail dela) e confirme o convite.
5. Helen receberá um convite por e-mail para aceitar.

---

## 🔑 Como Usar o Editor Visual (Sveltia CMS no `/admin/`)

O **Sveltia CMS** permite que você e a Helen editem todos os textos, tokens, releases e subam imagens sem precisar abrir código ou instalar nada no computador:

1. Acesse o GitHub: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em **Generate new token** -> **Generate new token (classic)**.
3. No campo **Note**, digite: `Sveltia CMS Token`.
4. Em **Expiration**, escolha o prazo desejado (ex: 90 dias ou No expiration).
5. Na lista de permissões (**Select scopes**), marque apenas a caixa:
   - ✅ **`repo`** (Full control of private repositories / Public repositories)
6. Role até o final e clique no botão verde **Generate token**.
7. Copie o token gerado (começa com `ghp_...`).
8. Acesse a URL do editor no navegador:
   👉 **`https://lariikimie.github.io/Locked-Unit-Design-System/admin/`**
9. Cole o seu token no campo de autenticação e confirme.
10. Pronto! Você verá as 7 seções organizadas em português. Ao alterar qualquer texto ou subir uma foto e clicar em **Salvar**, o CMS faz um commit automático no GitHub e o GitHub Pages atualiza o site sozinho!

---

## 👥 Créditos & Equipe

- **Larissa Kimie Ito Vieira Cassiano:** Game Designer Líder, UI/UX Designer, Programadora de Sistemas e Roteirista.
- **Helen Rayssa Santos Alves:** Technical Artist, Modeladora 3D e Programadora de IA.
- **Profª. Beatriz Blanco:** Orientadora de Design de Interface & Experiência do Jogador.
- **Profª. Eliana Hdib:** Orientadora Acadêmica do Senac Santo Amaro.
