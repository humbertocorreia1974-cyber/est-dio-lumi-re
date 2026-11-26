# Integrações externas do Estúdio Lumière

Este documento descreve as APIs externas usadas pelo projeto, o que cada uma faz e como configurar as chaves quando necessário.

## 1. Art Institute of Chicago

- **O que faz:** fornece um acervo público de obras de arte com imagens em alta resolução. Usamos para compor a galeria editorial do estúdio (imagens de referência visual, texturas e obras que inspiram o ambiente).
- **Base URL:** https://api.artic.edu/
- **Autenticação:** não requer chave. É uma API pública e gratuita.
- **Onde é usada:** server-side, em chamadas `fetch` para `https://api.artic.edu/api/v1/artworks?limit=12&fields=id,title,image_id,artist_display`.
- **Como funciona a imagem:** a URL final da imagem é montada como `https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`.
- **Limites:** uso razoável, sem rate limit rígido documentado. Recomendamos cache de algumas horas.
- **Onde pegar mais informações:** https://api.artic.edu/docs/

## 2. DummyImage

- **O que faz:** gera imagens placeholder com texto e cor de fundo. Usamos apenas em ambientes de desenvolvimento e em componentes de demonstração, nunca em produção com dados reais.
- **Base URL:** https://dummyimage.com/
- **Autenticação:** não requer chave.
- **Exemplo:** `https://dummyimage.com/1200x800/1e3a5f/ffffff&text=Estudio+Lumiere`
- **Onde pegar mais informações:** https://dummyimage.com/

## 3. WhatsApp Cloud API (Meta)

- **O que faz:** envia lembretes de agendamento e confirmações para os alunos via WhatsApp.
- **Base URL:** https://graph.facebook.com/v20.0/
- **Autenticação:** requer `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID`.
- **Como obter:**
  1. Acesse https://developers.facebook.com/ e crie um app do tipo "Business".
  2. Adicione o produto "WhatsApp".
  3. No painel do WhatsApp, copie o **Phone Number ID** e gere um **Access Token** permanente (via System User).
  4. Configure as variáveis de ambiente `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID` no deploy.
- **Onde é usada:** `app/api/whatsapp/webhook/route.ts` (recebe eventos) e no envio de lembretes.

## 4. Stripe

- **O que faz:** processa assinaturas mensais dos planos do estúdio.
- **Autenticação:** `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`.
- **Como obter:** https://dashboard.stripe.com/apikeys
- **Onde é usada:** `app/api/stripe/checkout/route.ts` e `app/api/stripe/webhook/route.ts` (já existem na fundação).

## 5. Resend / SMTP

- **O que faz:** envio de e-mails transacionais (boas-vindas, confirmação de agendamento, redefinição de senha).
- **Autenticação:** `RESEND_API_KEY` (ou credenciais SMTP).
- **Onde é usada:** `lib/email.ts` (já existe na fundação).

## Variáveis de ambiente necessárias

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
CRON_SECRET=
