# Revisão visual de Estúdio Lumière

Nota visual: **35/100** (medições no navegador: 60/100, avaliação de design: 10/100).

> A tela exibe apenas um estado de carregamento genérico (splash screen travada), impossibilitando qualquer avaliação de design da página inicial.

## O que foi medido na página renderizada

- Título principal visível: NÃO
- Imagens: 0 (0 grandes, 0 quebradas)
- Logo no cabeçalho: não
- Blocos animados: 0
- Rolagem lateral indevida: não
- Erros no console: 3

## Pontos a corrigir

- 🟠 Médio: a página não tem título principal (h1). — *Como corrigir:* Adicionar um h1 no hero.
- 🟠 Médio: quase sem imagem (0 <img>, 0 grande). — *Como corrigir:* Usar ASSETS.hero e ASSETS.photos.
- 🟠 Médio: o cabeçalho não mostra logo. — *Como corrigir:* Usar ASSETS.logo no header.
- 🟠 Médio: nenhum elemento animado (.rv) na página renderizada. — *Como corrigir:* Envolver seções em <Reveal>.
- 🟠 Médio: 3 erro(s) no console: Failed to load resource: the server responded with a status of 502 ()
- 🔴 Alto: A aplicação está travada na tela de carregamento ('App iniciando...') sem renderizar a página inicial. — *Como corrigir:* Corrigir o erro de carregamento ou redirecionar corretamente para a página inicial do app.
- 🟠 Médio: Uso de ícone de engrenagem padrão e texto genérico, demonstrando falta de identidade visual no estado de loading. — *Como corrigir:* Substituir por um loader customizado com a identidade visual e logo da marca.

_Gerado automaticamente pelo JGNEXT ao final da construção, abrindo o app e olhando o resultado._

## Correção automática

Tentada e desfeita para não piorar o app: revertido: a crítica de design achou mais problemas graves que antes.
