// Dados de um cliente. As fotos ficam na pasta clientes/albert/.
Xatspace.cliente({
  id: "albert",
  edicao: 1,
  genero: "m",

  nome: "Albert",
  sobrenome: "Alves",
  frase: "A coisa mais bonita que você pode fazer por alguém é poupá-lo do seu julgamento.",
  // Quem disse a frase. Vazio = a frase é sua (o Cartão-postal assina com a inicial).
  fraseAutor: "Desconhecido",
  destaque: "Poupar alguém do seu julgamento.",
  titulo: "Deveres de Casa",
  manchete: "Carioca descobre que não julgar é o maior gesto",
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
  // Ano-mês-dia. Vai no carimbo do Cartão-postal.
  nascimento: "1995-09-10",
  gostos: ["Fotografia", "Treino", "Música"],
  instagram: "albert.aalves",
  online: true,

  fotos: {
    perfil: "albert/perfil.jpg",
    destaque: "albert/foto-2.jpg",
    cenario: "albert/fundo.jpg",
    verso: "albert/foto-2.jpg",
    galeria: ["albert/foto-1.jpg", "albert/perfil.jpg", "albert/foto-2.jpg", "albert/fundo.jpg", "albert/fundo-3.jpg"]
  },

  // Uma música só: "youtube" com o código do vídeo, mais título e artista.
  // Playlist: "playlist" com o código depois de list= no link; "youtube" (opcional) é a
  // música que começa. Título e artista aparecem sozinhos, vindos do YouTube.
  // aleatorio: true toca a playlist em ordem sorteada (a primeira também é sorteada).
  musica: {
    playlist: "PLW5Jc_EwvhBk",
    aleatorio: true,
    youtube: "c6Cbtt0LdBA",
    titulo: "Ride Or Die",
    artista: "Fg HunCho"
  },

  // original, masculino, feminino, feminino-2 ou pastel-azul, pastel-menta, pastel-areia,
  // pastel-rosa, pastel-lilas, pastel-pessego. Vazio = cor original do modelo.
  // Também pode ser uma cor por modelo (nome da pasta), com "padrao" para os outros.
  cor: {
    "10-cartao-postal": "pastel-areia",
    padrao: ""
  }
});
