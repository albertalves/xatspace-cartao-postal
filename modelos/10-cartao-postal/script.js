// Modelo 10 · Cartão-postal
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

  // P.S. com a citação começando em minúscula, como se continuasse a frase
  var texto = (d.citacao.texto || "").trim();
  todos("[data-xs-ps]", function (el) {
    el.textContent = texto.charAt(0).toLowerCase() + texto.slice(1);
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

  // Clicar no cartão vira ele; links e o player continuam funcionando normalmente
  todos("[data-virar]", function (el) {
    el.addEventListener("click", function (e) {
      if (e.target.closest("a, button") || !el.classList.contains("entrou")) return;
      document.documentElement.classList.toggle("xs-virado");
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
  encolher(document.querySelector(".desk .ps"), 110);
  encolher(document.querySelector(".mob .msg"), 160);
  encolher(document.querySelector(".mob .ps"), 70);
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
});
