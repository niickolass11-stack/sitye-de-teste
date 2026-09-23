/* =========================================================
   CONFIGURAÇÃO — coloque aqui o seu número do WhatsApp
   Formato: código do país + DDD + número, SOMENTE NÚMEROS.
   Exemplo para um número de Belo Horizonte (31) 91234-5678:
   const WHATSAPP_NUMBER = "5531912345678";
   ========================================================= */
const WHATSAPP_NUMBER = "SEU_NUMERO_AQUI";

document.addEventListener("DOMContentLoaded", () => {
  // Atualiza o ano no rodapé automaticamente
  const anoAtual = document.getElementById("anoAtual");
  if (anoAtual) anoAtual.textContent = new Date().getFullYear();

  ligarBotoesDeServico();
  ligarFormulario();
});

/* =========================================================
   1) BOTÕES "TENHO INTERESSE" NOS CARDS DE SERVIÇO
   Ao clicar, rola até o formulário e pré-seleciona o
   tipo de site correspondente no <select>.
   ========================================================= */
function ligarBotoesDeServico() {
  const cards = document.querySelectorAll("#listaServicos .card");
  const selectTipoSite = document.getElementById("tipoSite");

  cards.forEach((card) => {
    const botao = card.querySelector(".btn--card");
    const servico = card.dataset.servico;

    botao.addEventListener("click", () => {
      // Seleciona a opção correspondente no formulário, se ela existir
      if (selectTipoSite) {
        const opcaoExiste = Array.from(selectTipoSite.options).some(
          (opt) => opt.value === servico
        );
        if (opcaoExiste) selectTipoSite.value = servico;
      }

      document
        .getElementById("orcamento")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* =========================================================
   2) ENVIO DO FORMULÁRIO PARA O NETLIFY FORMS
   Netlify Forms funciona por padrão com um <form> comum
   (recarregando a página). Para uma experiência mais fluida
   (sem recarregar e mostrando a tela de sucesso + WhatsApp),
   enviamos os dados via fetch() para a própria página, no
   formato que a Netlify espera: x-www-form-urlencoded.
   ========================================================= */
function ligarFormulario() {
  const form = document.getElementById("formOrcamento");
  const botaoEnviar = document.getElementById("btnEnviar");
  const mensagemErro = document.getElementById("formErro");

  if (!form) return;

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagemErro.hidden = true;

    // Validação nativa do HTML (campos "required") antes de enviar
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const dados = new FormData(form);

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: converterParaUrlEncoded(dados),
      });

      mostrarTelaDeSucesso(dados);
      form.reset();
      form.hidden = true;
    } catch (erro) {
      // Se o fetch falhar (ex: sem internet), avisamos o usuário
      // em vez de fingir que deu certo.
      mensagemErro.textContent =
        "Não foi possível enviar agora. Verifique sua conexão e tente novamente.";
      mensagemErro.hidden = false;
      console.error("Erro ao enviar formulário:", erro);
    } finally {
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = "Solicitar orçamento";
    }
  });
}

// Transforma um FormData em uma string "chave=valor&chave=valor",
// formato exigido pelo Netlify Forms ao enviar via fetch/AJAX.
function converterParaUrlEncoded(formData) {
  return Array.from(formData.entries())
    .map(
      ([chave, valor]) =>
        `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`
    )
    .join("&");
}

/* =========================================================
   3) TELA DE SUCESSO + BOTÃO DO WHATSAPP
   Depois do envio, exibimos a confirmação e montamos o link
   do WhatsApp já com a mensagem preenchida usando os dados
   que o cliente digitou no formulário.
   ========================================================= */
function mostrarTelaDeSucesso(dados) {
  const telaSucesso = document.getElementById("telaSucesso");
  const botaoWhatsapp = document.getElementById("btnWhatsapp");

  const nome = dados.get("nome") || "";
  const empresa = dados.get("empresa") || "não informado";
  const servico = dados.get("tipoSite") || "não informado";
  const descricao = dados.get("descricao") || "";

  const mensagem =
    `Olá Nickolas! Acabei de solicitar um orçamento pelo seu site.\n\n` +
    `Nome: ${nome}\n` +
    `Empresa: ${empresa}\n` +
    `Serviço: ${servico}\n` +
    `Projeto: ${descricao}`;

  botaoWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    mensagem
  )}`;

  telaSucesso.hidden = false;
  telaSucesso.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =========================================================
   SOBRE A INTEGRAÇÃO AUTOMÁTICA COM WHATSAPP (leia com atenção)
   =========================================================
   Este projeto NÃO envia mensagens automaticamente para o seu
   WhatsApp — isso exigiria uma API oficial (Meta/WhatsApp
   Business API) ou um serviço de terceiros, com tokens que
   nunca podem ficar expostos no navegador do cliente.

   O botão acima apenas abre o WhatsApp Web/App com uma
   mensagem pronta, e é o VISITANTE quem decide enviar ou não.
   Isso é seguro, simples e não exige nenhuma credencial.

   Se no futuro você quiser notificações automáticas (por
   exemplo, seu sistema avisar você mesmo sem o cliente clicar
   em nada), o caminho correto é:

   1. Criar uma Netlify Function (pasta netlify/functions/).
   2. Guardar o token da API do WhatsApp em uma variável de
      ambiente da Netlify (nunca no código do frontend).
   3. Fazer a Netlify Function chamar a API oficial do
      WhatsApp pelo lado do servidor, não pelo navegador.

   O README.md explica esse fluxo com mais detalhes.
   ========================================================= */
