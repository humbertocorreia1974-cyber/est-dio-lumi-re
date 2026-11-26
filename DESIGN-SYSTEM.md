# Sistema de design — Estúdio Lumière
Gerado com **UI/UX Pro Max** (curadoria de estilo + paleta + tipografia).
- **Estilo:** Organic Biophilic
- **Palavras-chave:** Nature, organic shapes, green, sustainable, rounded, flowing, wellness, earthy, natural textures
- **Modo:** light
- **Fontes:** Space Grotesk (títulos) / Inter (corpo)
- **Efeitos:** Rounded corners (16-24px), organic curves (border-radius variations), natural shadows, flowing SVG shapes
- **Padrão de landing:** Hero + Testimonials + CTA — Hero > Problem statement > Solution overview > Testimonials carousel > CTA
- **Evitar:** Inconsistent styling + Poor contrast ratios
## Tokens (CSS vars em `app/globals.css`)
```css
--bg: 210 40% 98%;
--surface: 0 0% 100%;
--surface-2: 221 25% 95%;
--border: 221 20% 88%;
--fg: 221 35% 14%;
--fg-muted: 221 15% 40%;
--brand: 221 83% 50%;
--brand-fg: 0 0% 100%;
--accent: 224 64% 33%;
--accent-fg: 0 0% 100%;
--danger: 0 72% 45%;
--danger-fg: 0 0% 100%;
--warning: 38 92% 50%;
--warning-fg: 20 40% 12%;
--success: 142 70% 33%;
--success-fg: 0 0% 100%;
```
_Use SEMPRE os tokens (`bg-brand`, `text-fg`, `border-border`…), nunca hex cru._