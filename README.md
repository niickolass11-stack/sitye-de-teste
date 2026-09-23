# Nickolas Martins | Sites e Sistemas — Projeto de teste (Netlify Forms)

Site de demonstração para aprender, na prática, como publicar um site estático
na Netlify que recebe dados de um formulário de orçamento, com aviso por
e-mail e um botão de continuação pelo WhatsApp.

## Estrutura do projeto

```
projeto-orcamento/
├── index.html      → estrutura da página (conteúdo e formulário)
├── style.css        → toda a estilização visual
├── script.js         → lógica: seleção de serviço, envio do formulário, WhatsApp
├── netlify.toml       → configurações de deploy da Netlify
└── README.md            → este tutorial
```

Não há pasta de Netlify Functions neste primeiro projeto porque o Netlify
Forms, sozinho, já resolve o fluxo pedido (receber e visualizar os envios).
No final deste README há uma seção explicando quando e como usar Functions
no futuro.

---

## 1. Abrir o projeto no VS Code

1. Extraia/descompacte a pasta `projeto-orcamento` em algum lugar do seu
   computador (ex: `Documentos/projetos/`).
2. Abra o VS Code.
3. Vá em **Arquivo → Abrir Pasta** e selecione a pasta `projeto-orcamento`.

## 2. Testar localmente

Como é um projeto simples de HTML/CSS/JS, você pode:

- **Opção mais fácil:** clicar duas vezes no `index.html` para abrir no navegador.
- **Opção recomendada:** instalar a extensão **Live Server** no VS Code,
  clicar com o botão direito no `index.html` e escolher **"Open with Live Server"**.
  Isso recarrega a página automaticamente a cada alteração.

> ⚠️ O envio do formulário **não vai funcionar de verdade** rodando localmente,
> porque o Netlify Forms só existe depois que o site é publicado na Netlify.
> Localmente, você só consegue testar o visual, a navegação e a seleção de
> serviços.

## 3. Criar um repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login.
2. Clique em **New repository**.
3. Dê um nome, por exemplo `site-orcamento-teste`.
4. Deixe como **público ou privado**, como preferir.
5. **Não** marque a opção de criar um README (você já tem um).
6. Clique em **Create repository**.

## 4. Enviar o projeto para o GitHub

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Primeiro commit do projeto de orçamento"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/site-orcamento-teste.git
git push -u origin main
```

Troque `SEU-USUARIO` pelo seu nome de usuário do GitHub.

## 5. Conectar o repositório à Netlify

1. Acesse [app.netlify.com](https://app.netlify.com) e faça login (pode usar
   sua conta do GitHub).
2. Clique em **Add new site → Import an existing project**.
3. Escolha **GitHub** e autorize o acesso, se pedido.
4. Selecione o repositório `site-orcamento-teste`.
5. Nas configurações de build, deixe como está (o `netlify.toml` já define
   `publish = "."` e nenhum comando de build é necessário).
6. Clique em **Deploy site**.

## 6. Fazer o deploy

A Netlify vai publicar o site automaticamente após o passo anterior. Ela
também gera uma URL provisória, algo como:

```
https://nome-aleatorio-123.netlify.app
```

Você pode alterar esse nome em **Site configuration → Change site name**.

## 7. Verificar se a Netlify reconheceu o formulário

1. No painel da Netlify, abra o seu site.
2. Vá até a aba **Forms** no menu lateral.
3. Se o deploy foi feito com sucesso, você deve ver o formulário
   **"orcamento"** listado ali — isso confirma que a Netlify detectou o
   atributo `data-netlify="true"` do `index.html` durante o build.

> Se o formulário **não** aparecer: confira se o deploy mais recente terminou
> sem erros (aba **Deploys**) e se o `index.html` publicado realmente contém
> o formulário com `data-netlify="true"` e `name="orcamento"`.

## 8. Fazer um envio de teste

1. Abra a URL do site publicado (pelo computador ou pelo celular).
2. Role até **"Solicitar orçamento"**.
3. Preencha todos os campos obrigatórios com dados de teste.
4. Clique em **"Solicitar orçamento"**.
5. Você deve ver a mensagem **"Solicitação enviada com sucesso!"** e o botão
   **"Continuar pelo WhatsApp"**.

## 9. Onde visualizar os formulários recebidos

No painel da Netlify: **Site → Forms → orcamento**. Cada envio de teste vai
aparecer ali, com todos os campos preenchidos.

## 10. Como configurar a notificação por e-mail

Por padrão, a Netlify **não** envia e-mail automaticamente — é preciso
ativar isso manualmente (e é por isso que nenhum e-mail seu está escrito
no código):

1. No painel da Netlify, vá em **Site configuration → Forms → Form notifications**.
2. Clique em **Add notification → Email notification**.
3. Escolha o formulário **orcamento**.
4. Informe o e-mail que deve receber os avisos (o seu).
5. Salve.

A partir daí, todo novo envio do formulário gera um e-mail automático para
você, sem precisar expor esse endereço no JavaScript público do site.

## 11. Onde colocar o seu número do WhatsApp

Abra o arquivo `script.js` e edite a primeira linha:

```js
const WHATSAPP_NUMBER = "SEU_NUMERO_AQUI";
```

Substitua por código do país + DDD + número, **somente números, sem
espaços, traços ou parênteses**. Exemplo para um número de Belo Horizonte
`(31) 91234-5678`:

```js
const WHATSAPP_NUMBER = "5531912345678";
```

- `55` → código do Brasil
- `31` → DDD
- `912345678` → número

Depois de editar, salve o arquivo, faça `git add .`, `git commit` e
`git push` novamente — a Netlify vai republicar o site automaticamente.

## 12. Como testar o botão do WhatsApp

1. Faça um novo envio de teste no formulário publicado.
2. Na tela de sucesso, clique em **"Continuar pelo WhatsApp"**.
3. Deve abrir o WhatsApp (Web ou app, dependendo do dispositivo) com uma
   conversa já iniciada para o número configurado, e a mensagem preenchida
   com os dados que você digitou no formulário.

---

## Sobre segurança (o que este projeto evita de propósito)

- Nenhuma senha, token, chave de API ou credencial aparece no `script.js`
  ou em qualquer arquivo público.
- O e-mail que recebe as notificações é configurado **dentro do painel da
  Netlify**, não no código — por isso ele não fica exposto para quem abrir
  o site no navegador e ver o código-fonte.
- O envio para o WhatsApp é feito abrindo um link (`https://wa.me/...`), que
  não exige nenhuma credencial e é sempre a própria pessoa quem decide enviar
  a mensagem.

## E se eu quiser notificações automáticas no futuro (sem depender do clique do cliente)?

O fluxo atual (botão que abre o WhatsApp) é seguro e suficiente para este
projeto de aprendizado. Se um dia você quiser ir além — por exemplo, seu
sistema avisar automaticamente um número de WhatsApp assim que alguém envia
o formulário, sem depender do cliente clicar em nada — o caminho correto é:

1. **Usar a API oficial do WhatsApp Business** (via Meta) ou um serviço
   intermediário como Twilio, que oferecem esse tipo de envio automático.
2. **Nunca colocar o token dessa API no `script.js`** ou em qualquer código
   que rode no navegador do visitante, porque qualquer pessoa poderia abrir
   o código-fonte da página e roubar essa credencial.
3. **Criar uma Netlify Function** (um pequeno arquivo JavaScript dentro de
   `netlify/functions/`, por exemplo `netlify/functions/notificar.js`). Esse
   código roda no servidor da Netlify, não no navegador do cliente.
4. **Guardar o token em uma variável de ambiente da Netlify**
   (`Site configuration → Environment variables`), nunca escrito diretamente
   no código.
5. A Netlify Function seria então chamada — por exemplo, disparada por um
   *webhook* de novo envio de formulário, ou chamada pelo próprio `script.js`
   depois do `fetch` de envio — e ela, rodando no servidor, faria a chamada
   autenticada para a API do WhatsApp usando a variável de ambiente.

Esse é um passo natural de evolução do projeto, mas fica fora do escopo
deste primeiro teste, que tem como foco aprender o fluxo básico de
Netlify + Netlify Forms.

---

## Próximos aprendizados sugeridos

- Trocar o botão "Continuar pelo WhatsApp" por um redirecionamento automático
  para uma página de agradecimento (`/obrigado`).
- Adicionar reCAPTCHA do Netlify Forms para reforçar a proteção contra spam.
- Criar uma Netlify Function simples (sem segredos) só para entender a
  estrutura, antes de integrar uma API real.
