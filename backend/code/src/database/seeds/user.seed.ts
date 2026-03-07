import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs';

async function seed() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('🌱 Conectado ao banco. Iniciando seed...');

  const userRepository = AppDataSource.getRepository('User');

  const passwordHash1 = await bcrypt.hash('Senha@12223', 10);
  const passwordHash2 = await bcrypt.hash('Senha@12333', 10);
  const passwordHash3 = await bcrypt.hash('lolpro23#', 10);

  const users = [
    { name: 'Alice Silva', email: 'alice@email.com', passwordHash: passwordHash1 },
    { name: 'Bruno Costa', email: 'bruno@email.com', passwordHash: passwordHash2 },
    { name: 'Carla Mendes', email: 'teste@email.com', passwordHash: passwordHash3 },
  ];

  for (const userData of users) {
    const exists = await userRepository.findOneBy({ email: userData.email });
    if (!exists) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✅ Usuário criado: ${userData.name}`);
    } else {
      console.log(`⚠️  Usuário já existe: ${userData.email}`);
    }
  }

  await AppDataSource.destroy();
  console.log('✅ Seed finalizado!');
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
