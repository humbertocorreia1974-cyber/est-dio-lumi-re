const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const senha = bcrypt.hashSync('Demo@1234', 10);

  try {
    const users = [
      { email: 'admin@demo.app', name: 'Administrador Lumière', role: 'admin' },
      { email: 'dono@demo.app', name: 'Helena Duarte', role: 'dono' },
      { email: 'professor@demo.app', name: 'Rafael Monteiro', role: 'professor' },
      { email: 'recepcao@demo.app', name: 'Camila Ferreira', role: 'recepcao' },
      { email: 'jogador@demo.app', name: 'Lucas Andrade', role: 'user' },
    ];
    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { email: u.email, name: u.name, role: u.role, passwordHash: senha, phone: '(11) 98765-4321', plan: 'premium', termsAcceptedAt: new Date() },
      });
    }
  } catch (e) { console.warn('[seed] pulou User:', e.message); }

  try {
    const owner = await prisma.user.findUnique({ where: { email: 'dono@demo.app' } });
    if (owner) {
      const n = await prisma.project.count();
      if (n === 0) await prisma.project.createMany({ data: [{ name: 'Estúdio Lumière — Sede Jardins', ownerId: owner.id }, { name: 'Estúdio Lumière — Unidade Moema', ownerId: owner.id }] });
    }
  } catch (e) { console.warn('[seed] pulou Project:', e.message); }

  try {
    const n = await prisma.plan.count();
    if (n === 0) await prisma.plan.createMany({ data: [
      { name: 'Mensal Básico', price: 189.9, durationMonths: 1, limitClassesPerMonth: 8, description: 'Acesso a 8 aulas por mês em qualquer modalidade.', type: 'mensal', active: true },
      { name: 'Trimestral Plus', price: 499.9, durationMonths: 3, limitClassesPerMonth: 16, description: '16 aulas mensais + avaliação física trimestral.', type: 'trimestral', active: true },
      { name: 'Anual Premium', price: 1799.9, durationMonths: 12, limitClassesPerMonth: 30, description: 'Aulas ilimitadas, personal trainer e acesso VIP.', type: 'anual', active: true },
    ] });
  } catch (e) { console.warn('[seed] pulou Plan:', e.message); }

  try {
    const n = await prisma.class.count();
    if (n === 0) await prisma.class.createMany({ data: [
      { name: 'Ballet Clássico Iniciante', type: 'Ballet', duration: 60, level: 'Iniciante', description: 'Fundamentos do ballet clássico com barra e centro.', capacity: 15 },
      { name: 'Jazz Contemporâneo', type: 'Jazz', duration: 75, level: 'Intermediário', description: 'Mistura de jazz e técnicas contemporâneas.', capacity: 20 },
      { name: 'Pilates Solo', type: 'Pilates', duration: 50, level: 'Todos', description: 'Fortalecimento do core e postura com exercícios no solo.', capacity: 12 },
      { name: 'Dança de Salão', type: 'Dança de Salão', duration: 60, level: 'Iniciante', description: 'Samba, forró e bolero para casais e solos.', capacity: 24 },
      { name: 'Yoga Restaurativa', type: 'Yoga', duration: 60, level: 'Todos', description: 'Posturas suaves e respiração para relaxamento profundo.', capacity: 18 },
    ] });
  } catch (e) { console.warn('[seed] pulou Class:', e.message); }

  try {
    const n = await prisma.workout.count();
    if (n === 0) {
      const w1 = await prisma.workout.create({ data: { name: 'Aquecimento Ballet', description: 'Sequência de aquecimento para ballet clássico.', totalDuration: 20, level: 'Iniciante', active: true } });
      const w2 = await prisma.workout.create({ data: { name: 'Core Pilates', description: 'Fortalecimento do core em 30 minutos.', totalDuration: 30, level: 'Intermediário', active: true } });
      await prisma.exercise.createMany({ data: [
        { name: 'Plié', type: 'Alongamento', duration: 5, repetitions: 10, description: 'Flexão de joelhos com postura ereta.', workoutId: w1.id },
        { name: 'Tendu', type: 'Técnica', duration: 5, repetitions: 12, description: 'Extensão do pé deslizando pelo chão.', workoutId: w1.id },
        { name: 'Prancha', type: 'Fortalecimento', duration: 3, repetitions: 3, description: 'Isometria para core e estabilidade.', workoutId: w2.id },
        { name: 'Elevação Pélvica', type: 'Fortalecimento', duration: 4, repetitions: 15, description: 'Ativação de glúteos e lombar.', workoutId: w2.id },
      ] });
    }
  } catch (e) { console.warn('[seed] pulou Workout/Exercise:', e.message); }

  try {
    const n = await prisma.booking.count();
    if (n === 0) {
      const user = await prisma.user.findUnique({ where: { email: 'jogador@demo.app' } });
      const classes = await prisma.class.findMany({ take: 3 });
      const plan = await prisma.plan.findFirst();
      if (user && classes.length && plan) {
        for (let i = 0; i < classes.length; i++) {
          const payment = await prisma.payment.create({ data: { paymentDate: new Date(), value: 189.9, method: 'pix', status: 'pago', description: `Pagamento aula ${classes[i].name}`, planId: plan.id } });
          const booking = await prisma.booking.create({ data: { schedulingDate: new Date(Date.now() + (i + 1) * 86400000), status: 'confirmado', price: 189.9, observations: 'Aula de demonstração', confirmationCode: `LUM${1000 + i}`, classId: classes[i].id, userId: user.id, paymentId: payment.id } });
          await prisma.payment.update({ where: { id: payment.id }, data: { bookingId: booking.id } });
          await prisma.checkIn.create({ data: { date: new Date(), hour: '10:00', present: true, observations: 'Check-in realizado', bookingId: booking.id } });
          await prisma.progress.create({ data: { registerDate: new Date(), weight: 68.5 + i, fatPercentage: 22.3 - i, level: 'Intermediário', observations: 'Evolução consistente', bookingId: booking.id } });
        }
      }
    }
  } catch (e) { console.warn('[seed] pulou Booking/Payment/CheckIn/Progress:', e.message); }

  try {
    const n = await prisma.studioInfo.count();
    if (n === 0) {
      const studio = await prisma.studioInfo.create({ data: { name: 'Estúdio Lumière', address: 'Rua Oscar Freire, 1234 — Jardins, São Paulo/SP', phone: '(11) 3456-7890', email: 'contato@estudiolumiere.com.br', workingHours: 'Seg-Sex 07h-22h | Sáb 08h-18h', description: 'Estúdio de dança e bem-estar no coração dos Jardins.', coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad' } });
      await prisma.galleryImage.createMany({ data: [
        { title: 'Sala de Ballet', description: 'Nossa sala principal com espelhos e barra.', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a', uploadDate: new Date(), studioId: studio.id },
        { title: 'Estúdio de Pilates', description: 'Equipamentos modernos para pilates solo e aparelhos.', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a', uploadDate: new Date(), studioId: studio.id },
        { title: 'Recepção', description: 'Ambiente acolhedor para nossos alunos.', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36', uploadDate: new Date(), studioId: studio.id },
      ] });
    }
  } catch (e) { console.warn('[seed] pulou StudioInfo/GalleryImage:', e.message); }

  try {
    const user = await prisma.user.findUnique({ where: { email: 'jogador@demo.app' } });
    if (user) {
      const n = await prisma.notification.count();
      if (n === 0) await prisma.notification.createMany({ data: [
        { message: 'Sua aula de Ballet foi confirmada para amanhã às 10h.', read: false, userId: user.id },
        { message: 'Novo plano Anual Premium disponível com desconto!', read: false, userId: user.id },
        { message: 'Avaliação física agendada para sexta-feira.', read: true, userId: user.id },
      ] });
    }
  } catch (e) { console.warn('[seed] pulou Notification:', e.message); }
}

main().then(()=>prisma.$disconnect()).catch(async(e)=>{console.error('[seed] ERRO:',e.message);await prisma.$disconnect();process.exitCode = 0;});