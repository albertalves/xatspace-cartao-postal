// Cartão-postal
Xatspace.aoCarregar(function (d) {
  var todos = function (sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  };
  var meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  var hoje = new Date();

  // Assinatura da frase: o autor, se a frase não for da pessoa; senão a inicial do nome
  todos("[data-xs-inicial]", function (el) {
    el.textContent = (d.fraseAutor || (d.nome || "").charAt(0).toUpperCase()) + ".";
  });

  // "Gosta de: fotografia, treino & música"
  var gostos = d.gostos.map(function (g) { return g.toLowerCase(); });
  var lista = gostos.length > 1 ? gostos.slice(0, -1).join(", ") + " & " + gostos[gostos.length - 1] : gostos.join("");
  todos("[data-xs-gostos]", function (el) {
    el.textContent = "Gosta de: " + lista;
    el.hidden = !lista;
  });

  // Carimbo do correio: cidade e data de nascimento (sem ela, a data de hoje)
  var nasc = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d.nascimento || "");
  var data = nasc
    ? Number(nasc[3]) + " " + meses[Number(nasc[2]) - 1] + " " + nasc[1]
    : hoje.getDate() + " " + meses[hoje.getMonth()] + " " + hoje.getFullYear();
  var linhas = [(d.local || "").toUpperCase(), data];
  function carimbo(el) {
    el.textContent = "";
    // A linha de cima fica perto da borda do círculo, então a largura útil é menor
    var largura = el.clientWidth * 0.7;
    linhas.forEach(function (t) {
      if (!t) return;
      var s = document.createElement("span");
      s.textContent = t;
      el.appendChild(s);
      // Cidades longas diminuem para não sair do círculo (a letra aqui já é menor que 12px)
      s.style.display = "inline-block";
      var tamanho = parseFloat(getComputedStyle(s).fontSize);
      while (s.scrollWidth > largura && tamanho > 5) {
        tamanho *= 0.95;
        s.style.fontSize = tamanho + "px";
      }
      s.style.display = "block";
    });
  }
  todos("[data-xs-carimbo]", carimbo);
  // Mede de novo quando as fontes terminam de carregar
  if (document.fonts) document.fonts.ready.then(function () { todos("[data-xs-carimbo]", carimbo); });

  // Verso: a citação inteira, uma estrofe por parágrafo (linha em branco separa)
  var poema = (d.citacao.poema || d.citacao.texto || "").trim();
  todos("[data-xs-poema]", function (el) {
    el.textContent = "";
    poema.split(/\n\s*\n/).forEach(function (estrofe) {
      var p = document.createElement("p");
      estrofe.split("\n").forEach(function (linha, i) {
        if (i) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(linha.trim()));
      });
      el.appendChild(p);
    });
  });

  // Sem foto própria para o verso, usa a foto de destaque
  var fotoVerso = d.fotos.verso || d.fotos.destaque || d.fotos.perfil;
  todos('[data-xs-bg="fotos.verso"]', function (el) {
    if (fotoVerso) el.style.backgroundImage = "url('" + Xatspace.arquivo(fotoVerso) + "')";
  });

  // A transição da virada só liga quando o cartão termina de entrar na tela
  todos("[data-virar]", function (el) {
    function entrou() { el.classList.add("entrou"); }
    el.addEventListener("animationend", function (e) {
      if (e.target === el) entrou();
    });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) entrou();
  });

  // Clicar no cartão vira ele; links e o player continuam funcionando normalmente.
  // O 3D (xs-girando) só fica ligado enquanto ele gira, para o texto parado ficar nítido.
  var raiz = document.documentElement;
  todos("[data-virar]", function (el) {
    el.addEventListener("click", function (e) {
      if (e.target.closest("a, button") || !el.classList.contains("entrou")) return;
      raiz.classList.add("xs-girando");
      raiz.classList.toggle("xs-virado");
    });
    el.addEventListener("transitionend", function (e) {
      if (e.target === el && e.propertyName === "transform") raiz.classList.remove("xs-girando");
    });
  });

  // Mensagens longas diminuem para não encostar no que vem embaixo
  function encolher(el, alturaMax) {
    if (!el) return;
    var tamanho = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollHeight > alturaMax && tamanho > 10) {
      tamanho *= 0.95;
      el.style.fontSize = tamanho + "px";
    }
  }
  encolher(document.querySelector(".desk .msg"), 320);
  encolher(document.querySelector(".mob .msg"), 160);
  // Os versos ocupam o espaço que sobra no verso (flex: 1) e diminuem até caber nele.
  // Mede de novo quando as fontes carregam, porque a letra provisória é mais larga.
  function caberPoema() {
    todos(".versos", function (el) {
      el.style.fontSize = "";
      encolher(el, el.clientHeight);
    });
    Xatspace.caber(document.querySelector(".desk .poema h2"), 680);
    Xatspace.caber(document.querySelector(".mob .poema h2"), 300);
  }
  caberPoema();
  if (document.fonts) document.fonts.ready.then(caberPoema);

  // Nomes longos diminuem para caber na foto
  Xatspace.caber(document.querySelector(".desk .pic h1"), 550);
  Xatspace.caber(document.querySelector(".mob .pic h1"), 300);

  // ---------- Envelope ----------
  // Começa fechado. Abrir dá o play e depois mostra o cartão com a entrada de sempre.
  // Dentro do xat o clique passa pelo envelope e cai no vídeo do YouTube (é o único
  // jeito de liberar o som lá): o envelope abre quando a música começa ou quando o
  // vídeo recebe o clique.
  var envelope = document.querySelector("[data-envelope]");
  todos("[data-env-inicial]", function (el) {
    el.textContent = (d.nome || "").charAt(0).toUpperCase();
  });
  if (!envelope) return;
  var aberto = false;
  var env = envelope.querySelector(".env");

  // Mesmo tamanho do cartão na tela (o palco é reduzido com scale). No computador fica
  // no lugar do cartão; no celular, no meio da tela, para a carta ter espaço para subir.
  function medir() {
    var celular = raiz.classList.contains("xs-mobile");
    var cartao = document.querySelector(celular ? ".mob .front" : ".desk .cartao");
    if (!cartao) return;
    var palco = cartao.closest(".xs-palco");
    var escala = palco.getBoundingClientRect().width / palco.offsetWidth;
    var r = cartao.getBoundingClientRect();
    env.style.setProperty("--env-w", cartao.offsetWidth * escala + "px");
    env.style.setProperty("--env-h", cartao.offsetHeight * escala + "px");
    env.style.setProperty("--env-x", (celular ? innerWidth / 2 : r.left + r.width / 2) + "px");
    env.style.setProperty("--env-y", (celular ? innerHeight / 2 - 30 : r.top + r.height / 2) + "px");
  }
  // O palco é ajustado depois deste script; mede em seguida e a cada redimensionamento
  setTimeout(medir, 0);
  window.addEventListener("resize", medir);

  function abrir() {
    if (aberto) return;
    aberto = true;
    window.removeEventListener("resize", medir);
    Xatspace.tocar();
    envelope.classList.add("abrindo");
    var reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A aba abre e a carta sobe; quando ela termina, o envelope some num fade
    // (style.css) ao mesmo tempo em que o cartão desce para o lugar
    setTimeout(function () { raiz.classList.remove("xs-envelope"); }, reduzido ? 0 : 1150);
    setTimeout(function () { envelope.remove(); }, reduzido ? 0 : 2100);
  }

  envelope.addEventListener("click", abrir);
  envelope.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  });

  // No xat: a música começou (clique no vídeo) ou o foco foi para o vídeo
  new MutationObserver(function () {
    if (raiz.classList.contains("xs-tocando")) abrir();
  }).observe(raiz, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("blur", function () {
    setTimeout(function () {
      var foco = document.activeElement;
      if (foco && foco.tagName === "IFRAME") abrir();
    }, 0);
  });
});
