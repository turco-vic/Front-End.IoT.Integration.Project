const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('');
  console.log('');
  console.log('🌱 Iniciando seed...');

  await prisma.movimentacao.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.produtoIoT.deleteMany();

  console.log('🧹 Dados antigos removidos.');

  const usuarios = await prisma.usuario.createMany({
    data: [
      { nome: 'admin', senha: bcrypt.hashSync('123', 10) },
      { nome: 'turco', senha: bcrypt.hashSync('1234', 10) },
    ],
  });

  console.log('👤 Usuários criados.');

  const produtosIoT = await prisma.produtoIoT.createMany({
    data: [
      { nome: 'Sensor de Temperatura', categoria: 'Sensores', estoque_minimo: 10 },
      { nome: 'Sensor de Umidade', categoria: 'Sensores', estoque_minimo: 15 },
      { nome: 'Arduino Uno', categoria: 'Microcontroladores', estoque_minimo: 5 },
      { nome: 'Raspberry Pi 4', categoria: 'Microcontroladores', estoque_minimo: 8 },
      { nome: 'Módulo ESP32', categoria: 'Conectividade', estoque_minimo: 12 },
    ],
  });
  console.log('🍔 Produtos IoT criados.');
}

main()
  .then(() => console.log('✅ Seed concluído com sucesso!'))
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
