/*
  Motor do cartão.

  1. Recebe os dados (dados.js chama Xatspace.cliente({ ... }))
  2. Preenche a página com os dados (atributos data-xs-*)
  3. Aplica a cor (?cor=nome no link, ou "cor" nos dados)
  4. Ajusta o tamanho do palco (desktop e mobile)
  5. Liga o player de música do YouTube
  6. Coloca a marca d'água
*/
(function () {
  var config = {};
  var raiz = document.documentElement;
  var base = new URL("./", document.currentScript.src).href;
  var aoCarregar = [];
  var dados = null;

  window.Xatspace = {
    // Chamado pelo arquivo do cliente: Xatspace.cliente({ ... })
    cliente: function (d) {
      if (dados) return;
      config = d.config || {};
      dados = preparar(d);
      iniciar();
    },
    // Chamado pelo script.js do modelo para ajustes próprios
    aoCarregar: function (fn) {
      if (dados) fn(dados);
      else aoCarregar.push(fn);
    },
    // Começa a música agora (ex.: ao abrir o envelope). Chamar dentro de um clique.
    tocar: function () {
      raiz.classList.remove("xs-esperar");
      if (comecar) comecar();
    },
    get: get,
    arquivo: arquivo,
    caber: caber
  };

  // Diminui a fonte até o texto caber na largura máxima (nomes longos)
  function caber(el, larguraMax, minimo) {
    if (!el) return;
    minimo = minimo || 6;
    el.style.fontSize = "";
    var tamanho = parseFloat(getComputedStyle(el).fontSize);
    el.style.whiteSpace = "nowrap";
    el.style.display = "inline-block";
    while (el.scrollWidth > larguraMax && tamanho > minimo) {
      tamanho *= 0.95;
      el.style.fontSize = tamanho + "px";
    }
  }

  var params = new URLSearchParams(location.search);

  // ---------- Dados ----------

  function get(obj, caminho) {
    return caminho.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  // Caminho relativo é relativo à pasta do cartão; links completos ficam como estão
  function arquivo(caminho) {
    if (!caminho) return "";
    if (/^(https?:|data:|\/)/.test(caminho)) return caminho;
    return base + caminho;
  }

  // Campos calculados a partir dos dados do cliente
  function preparar(d) {
    var nome = d.nome || "";
    var sobrenome = d.sobrenome || "";
    var fem = d.genero === "f";
    d.nomeCompleto = (nome + " " + sobrenome).trim();
    d.iniciais = (nome.charAt(0) + sobrenome.charAt(0)).toUpperCase();
    d.instagramUrl = d.instagram ? "https://instagram.com/" + d.instagram : "";
    d.edicaoTexto = "nº " + String(d.edicao || 1).padStart(3, "0");
    d.gostos = d.gostos || [];
    d.fotos = d.fotos || {};
    d.musica = d.musica || {};
    d.citacao = d.citacao || {};
    d.titulo = d.titulo || "Deveres de Casa";
    d.destaque = d.destaque || d.frase;
    d.o = fem ? "a" : "o";
    d.local = d.local || "";
    d.localDe = comPreposicao(d.local);
    return d;
  }

  // "do Rio de Janeiro", "do Recife", "de São Paulo"...
  function comPreposicao(local) {
    if (!local) return "";
    if (/^(Rio|Recife|Porto|Crato|Cabo|Gama|Guarujá)\b/i.test(local)) return "do " + local;
    return "de " + local;
  }

  // ---------- Preenchimento ----------

  function preencher(d) {
    each("[data-xs]", function (el) {
      var v = get(d, el.dataset.xs);
      if (v != null && v !== "") el.textContent = v;
    });
    each("[data-xs-lista]", function (el) {
      var v = get(d, el.dataset.xsLista) || [];
      el.textContent = v.join(el.dataset.xsSep || ", ");
    });
    each("[data-xs-bg]", function (el) {
      var v = get(d, el.dataset.xsBg);
      if (v) el.style.backgroundImage = "url('" + arquivo(v) + "')";
    });
    each("[data-xs-img]", function (el) {
      var v = get(d, el.dataset.xsImg);
      if (v) el.src = arquivo(v);
    });
    each("[data-xs-link]", function (el) {
      var v = get(d, el.dataset.xsLink);
      if (v) {
        el.href = v;
        el.target = "_blank";
        el.rel = "noopener";
      }
    });
    each("[data-xs-se]", function (el) {
      if (!get(d, el.dataset.xsSe)) el.hidden = true;
    });
    if (d.nomeCompleto) document.title = d.nomeCompleto;
  }

  function aplicarCor(d) {
    var cores = (raiz.dataset.cores || "").split(/\s+/).filter(Boolean);
    var pedida = params.get("cor") || d.cor;
    var cor = cores.indexOf(pedida) >= 0 ? pedida : cores[0];
    if (pedida && pedida !== cor) console.warn("[xatspace] cor não existe neste modelo:", pedida, "— usando", cor);
    raiz.dataset.cor = cor;
  }

  function each(sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  }

  // ---------- Palco ----------

  // Cada layout foi desenhado num tamanho fixo (ex.: 1920×900 e 390×844)
  // e é ampliado ou reduzido para caber na tela.
  function ajustarPalco() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var mobile = w < 760 || w / h < 0.75;
    raiz.classList.toggle("xs-mobile", mobile);

    each(".xs-palco", function (palco) {
      var pw = Number(palco.dataset.largura);
      var ph = Number(palco.dataset.altura);
      var ehMobile = palco.classList.contains("xs-palco--mobile");
      if (ehMobile !== mobile) return;

      if (ehMobile) {
        // No celular ocupa a largura toda e cresce para baixo se precisar
        var e = w / pw;
        var altura = Math.max(ph, h / e);
        palco.style.height = altura + "px";
        palco.style.transform = "scale(" + e + ")";
        palco.style.left = "0px";
        palco.style.top = "0px";
        document.body.style.height = altura * e + "px";
      } else {
        var esc = Math.min(w / pw, h / ph);
        palco.style.height = ph + "px";
        palco.style.transform = "scale(" + esc + ")";
        palco.style.left = (w - pw * esc) / 2 + "px";
        palco.style.top = (h - ph * esc) / 2 + "px";
        document.body.style.height = "";
      }
    });
  }

  // ---------- Música ----------

  var player = null;
  var pausadoPeloUsuario = false;
  var video = null;
  var comecar = null;

  // Com a classe xs-esperar no <html> (ex.: envelope fechado), a música não
  // tenta começar sozinha: espera o Xatspace.tocar()
  function esperando() {
    return raiz.classList.contains("xs-esperar");
  }

  // Dentro do xat o som só libera com um clique no próprio vídeo do YouTube
  var emMoldura = true;
  try {
    emMoldura = window.self !== window.top;
  } catch (e) {}

  // Até a música começar, o vídeo fica atrás da página inteira, cobrindo a tela,
  // e a página deixa os cliques passarem: qualquer clique cai no vídeo e dá o play.
  // Uma capa com o mesmo fundo da página esconde o vídeo.
  function ligarToque(ligar) {
    raiz.classList.toggle("xs-toque", ligar);
  }

  function criarCapa() {
    var capa = document.createElement("div");
    capa.className = "xs-capa-toque";
    var fundo = getComputedStyle(document.body);
    if (fundo.backgroundImage === "none" && fundo.backgroundColor === "rgba(0, 0, 0, 0)") {
      fundo = getComputedStyle(raiz);
    }
    ["backgroundColor", "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat"].forEach(function (k) {
      capa.style[k] = fundo[k];
    });
    // Logo depois do vídeo, para ficar por cima dele
    video.parentNode.insertBefore(capa, video.nextSibling);
  }

  function marcarPlayers(classe, ligar) {
    each("[data-xs-player]", function (el) {
      el.classList.toggle(classe, ligar);
    });
  }

  function tocando() {
    return player && player.getPlayerState && player.getPlayerState() === YT.PlayerState.PLAYING;
  }

  function setTocando(sim) {
    marcarPlayers("is-playing", sim);
    raiz.classList.toggle("xs-tocando", sim);
    each("[data-xs-tocar]", function (b) {
      b.setAttribute("aria-label", sim ? "Pausar música" : "Tocar música");
    });
    if (sim) ligarToque(false);
  }

  function tempo(s) {
    s = Math.floor(s || 0);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  // Numa playlist, o nome da música e do canal vêm do próprio YouTube a cada troca
  function atualizarFaixa(d) {
    var info = player.getVideoData ? player.getVideoData() : null;
    if (!info || !info.title) return;
    d.musica.titulo = info.title;
    d.musica.artista = info.author || "";
    each('[data-xs="musica.titulo"]', function (el) { el.textContent = d.musica.titulo; });
    each('[data-xs="musica.artista"]', function (el) { el.textContent = d.musica.artista; });
  }

  function iniciarMusica(d) {
    var id = d.musica.youtube;
    var lista = d.musica.playlist;
    var aleatorio = !!(lista && d.musica.aleatorio);
    var embaralhada = false;
    if ((!id && !lista) || !document.querySelector("[data-xs-player]")) return;
    // Os botões de anterior/próxima só aparecem quando é playlist
    raiz.classList.toggle("xs-playlist", !!lista);

    video = document.createElement("div");
    video.className = "xs-yt";
    video.innerHTML = '<div id="xs-yt-player"></div>';
    document.body.insertBefore(video, document.body.firstChild);
    if (emMoldura) {
      criarCapa();
      ligarToque(true);
      // Se o clique não fizer a música tocar (ex.: vídeo bloqueado), a página volta
      // a responder normalmente para não ficar "travada"
      window.addEventListener("blur", function () {
        setTimeout(function () {
          if (!tocando()) ligarToque(false);
        }, 2500);
      }, { once: true });
    }

    each("[data-xs-tocar]", function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!player) return;
        if (tocando()) {
          pausadoPeloUsuario = true;
          player.pauseVideo();
        } else {
          pausadoPeloUsuario = false;
          player.playVideo();
        }
      });
    });

    // O navegador só deixa tocar som depois que a pessoa interage com a página
    function tocarNaPrimeiraInteracao() {
      function start() {
        if (esperando()) return;
        document.removeEventListener("pointerdown", start);
        document.removeEventListener("keydown", start);
        if (player && !pausadoPeloUsuario && !tocando()) player.playVideo();
      }
      document.addEventListener("pointerdown", start);
      document.addEventListener("keydown", start);
    }

    function pular(sel, metodo) {
      each(sel, function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          if (!player || !player[metodo]) return;
          pausadoPeloUsuario = false;
          player[metodo]();
        });
      });
    }
    pular("[data-xs-anterior]", "previousVideo");
    pular("[data-xs-proxima]", "nextVideo");

    // Uma música só repete sozinha; a playlist toca em ordem e recomeça no fim
    var vars = { autoplay: 1, loop: 1, controls: 0, playsinline: 1 };
    if (lista) {
      vars.listType = "playlist";
      vars.list = lista;
    } else {
      vars.playlist = id;
    }

    // Modo aleatório: embaralha assim que o YouTube carrega a lista e começa
    // pela primeira da ordem nova, para a música inicial também ser sorteada
    function embaralhar() {
      if (!aleatorio || embaralhada || !player.getPlaylist) return;
      var musicas = player.getPlaylist();
      if (!musicas || !musicas.length) return;
      embaralhada = true;
      player.setShuffle(true);
      if (!esperando()) player.playVideoAt(0);
    }

    // Esperando, o play fica para o Xatspace.tocar(); no aleatório começa pela
    // primeira música da ordem já embaralhada
    comecar = function () {
      if (!player || !player.playVideo || tocando()) return;
      pausadoPeloUsuario = false;
      if (aleatorio && embaralhada) player.playVideoAt(0);
      else player.playVideo();
    };

    window.onYouTubeIframeAPIReady = function () {
      var opcoes = {
        width: "100%",
        height: "100%",
        playerVars: vars,
        events: {
          onReady: function (e) {
            e.target.setVolume(config.volume || 60);
            if (!esperando()) e.target.playVideo();
            embaralhar();
            setTimeout(function () {
              if (!tocando()) tocarNaPrimeiraInteracao();
            }, 1200);
          },
          onStateChange: function (e) {
            setTocando(e.data === YT.PlayerState.PLAYING);
            embaralhar();
            if (lista) atualizarFaixa(d);
          },
          onError: function () {
            ligarToque(false);
          }
        }
      };
      // No aleatório não fixa a primeira música (e o YouTube não aceita videoId vazio)
      if (id && !aleatorio) opcoes.videoId = id;
      player = new YT.Player("xs-yt-player", opcoes);

      setInterval(function () {
        if (!player || !player.getDuration) return;
        var total = player.getDuration();
        if (!total) return;
        var agora = player.getCurrentTime();
        raiz.style.setProperty("--xs-progresso", (agora / total) * 100 + "%");
        each("[data-xs-tempo]", function (el) { el.textContent = tempo(agora); });
        each("[data-xs-duracao]", function (el) { el.textContent = tempo(total); });
      }, 500);
    };

    var api = document.createElement("script");
    api.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(api);
  }

  // ---------- Marca d'água ----------

  // Selo no canto: um ícone que abre o convite ao passar o mouse
  function marcaDagua(d) {
    if (d.semMarca) return;
    var a = document.createElement("a");
    a.className = "xs-marca";
    a.href = config.link;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = config.convite;
    a.setAttribute("aria-label", config.convite);
    a.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5z"/><path d="M19 15.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3z" opacity=".6"/></svg>' +
      '<span class="xs-marca__t"></span>';
    a.querySelector(".xs-marca__t").textContent = config.convite;
    document.body.appendChild(a);

    // Mostra o convite aberto por alguns segundos, depois de a página aparecer,
    // e de novo de tempos em tempos, para quem chega saber que o selo existe
    function espiar() {
      a.classList.add("is-aberta");
      setTimeout(function () { a.classList.remove("is-aberta"); }, 4000);
    }
    setTimeout(espiar, 1500);
    setInterval(espiar, 30000);
  }

  // ---------- Início ----------

  function mostrar() {
    raiz.classList.add("xs-pronto");
  }

  function iniciar() {
    var go = function () {
      aplicarCor(dados);
      preencher(dados);
      aoCarregar.forEach(function (fn) { fn(dados); });
      marcaDagua(dados);
      ajustarPalco();
      iniciarMusica(dados);
      mostrar();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
    else go();
  }

  window.addEventListener("resize", ajustarPalco);
  // Se algo der errado, mostra a página mesmo assim
  setTimeout(mostrar, 4000);

})();
