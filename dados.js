// Seus dados. Trocar foto, frase ou música é só mexer aqui.
Xatspace.cliente({
  nome: "Albert",
  sobrenome: "Alves",
  frase: "A coisa mais bonita que você pode fazer por alguém é poupá-lo do seu julgamento.",
  // Quem disse a frase. Vazio = a frase é sua (assina com a inicial).
  fraseAutor: "Desconhecido",
  // Poema inteiro do verso
  citacao: {
    texto: "A vida é uns deveres que nós trouxemos para fazer em casa.",
    autor: "Mario Quintana",
    // Citação inteira, para os modelos que mostram o texto todo (ex.: verso do Cartão-postal).
    // Linha em branco separa as estrofes.
    titulo: "Seiscentos e Sessenta e Seis",
    poema: [
      "A vida é uns deveres que nós trouxemos para fazer em casa.",
      "Quando se vê, já são 6 horas: há tempo…",
      "Quando se vê, já é 6ª-feira…",
      "Quando se vê, passaram 60 anos!",
      "Agora, é tarde demais para ser reprovado…",
      "E se me dessem – um dia – uma outra oportunidade,",
      "Eu nem olhava o relógio",
      "Seguia sempre em frente…",
      "E iria jogando pelo caminho a casca dourada e inútil das horas."
    ].join("\n")
  },

  local: "Rio de Janeiro",
  // Ano-mês-dia. Vai no carimbo.
  nascimento: "1995-09-10",
  gostos: ["Fotografia", "Treino", "Música"],
  instagram: "albert.aalves",

  // Caminhos a partir desta pasta, ou links completos (https://...)
  fotos: {
    cenario: "fotos/fundo.jpg",      // frente do cartão
    perfil: "fotos/perfil.jpg",      // selo
    verso: "fotos/academia.jpg"      // verso, ao lado do poema
  },

  // playlist: código depois de list= no link. aleatorio: toca em ordem sorteada.
  // Para uma música só, tire "playlist" e deixe "youtube", "titulo" e "artista".
  musica: {
    playlist: "PLW5Jc_EwvhBk",
    aleatorio: true,
    youtube: "c6Cbtt0LdBA",
    titulo: "Ride Or Die",
    artista: "Fg HunCho"
  },

  // original, masculino, feminino, feminino-2, pastel-azul, pastel-menta, pastel-areia,
  // pastel-rosa, pastel-lilas ou pastel-pessego
  cor: "pastel-areia",

  // Selo no canto: leva para o site dos xatspaces
  config: {
    link: "http://www.xatspaces.com/",
    convite: "Quero um xatspace assim",
    volume: 60
  }
});
