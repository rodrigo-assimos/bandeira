# Que Bandeira É?

Jogo de adivinhar a bandeira de 134 países. A cada rodada aparecem 4 alternativas:

- **Acertou:** a bandeira pula, sai confete, toca um som positivo e vem a próxima bandeira.
- **Errou:** a bandeira treme, toca um som de erro e a opção errada fica bloqueada até você acertar.

Não precisa de login, cadastro nem instalação.

## Como jogar

Abra o arquivo `index.html` no navegador (dois cliques no arquivo já funcionam).

## Estrutura do projeto

| Arquivo | O que faz |
|---|---|
| `index.html` | A estrutura da página: título, placar, bandeira e área dos botões |
| `css/style.css` | A aparência: cores, tamanhos, tema claro/escuro e animações |
| `js/countries.js` | A lista de países (código e nome em português) |
| `js/game.js` | A lógica do jogo: sorteio, acerto/erro, sons e confete |
| `flags/` | Os desenhos das bandeiras, um arquivo `.svg` por país |

## Créditos

Desenhos das bandeiras do projeto [flag-icons](https://github.com/lipis/flag-icons), licença MIT (veja `flags/LICENSE-flag-icons.txt`).
