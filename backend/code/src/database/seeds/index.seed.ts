/**
 * seed/index.ts — Runner principal que executa todos os seeds em ordem.
 * Para adicionar um novo seed, importe a função aqui e chame dentro de runAll().
 */
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs';

async function runAll() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('🌱 Iniciando todos os seeds...\n');

  // ── 1. Usuários ──────────────────────────────────────────────────────────────
  console.log('👤 [1/2] Rodando seed de usuários...');
  const userRepo = AppDataSource.getRepository('User');

  const passwordHash1 = await bcrypt.hash('Senha@12223', 10);
  const passwordHash2 = await bcrypt.hash('Senha@12333', 10);
  const passwordHash3 = await bcrypt.hash('lolpro23#', 10);

  const users = [
    { name: 'Alice Silva',  email: 'alice@email.com',  passwordHash: passwordHash1 },
    { name: 'Bruno Costa',  email: 'bruno@email.com',  passwordHash: passwordHash2 },
    { name: 'Carla Mendes', email: 'teste@email.com',  passwordHash: passwordHash3 },
  ];

  for (const userData of users) {
    const exists = await userRepo.findOneBy({ email: userData.email });
    if (!exists) {
      const user = userRepo.create(userData);
      await userRepo.save(user);
      console.log(`  ✅ Usuário criado: ${userData.name}`);
    } else {
      console.log(`  ⚠️  Já existe: ${userData.email}`);
    }
  }

  // ── 2. Personagens, Campanhas e Memberships ───────────────────────────────────
  console.log('\n🎲 [2/2] Rodando seed de personagens e campanhas...');
  const characterRepo  = AppDataSource.getRepository('Character');
  const campaignRepo   = AppDataSource.getRepository('Campaign');
  const membershipRepo = AppDataSource.getRepository('CampaignMembership');

  const lucas = await userRepo.findOneBy({ email: 'teste@email.com' });
  const alice = await userRepo.findOneBy({ email: 'alice@email.com' });

  if (!lucas || !alice) {
    console.log('  ⚠️  Usuários não encontrados para seed de RPG.');
  } else {
    // Personagens do Lucas
    const characters = [
      {
        name: 'Eldrin Lightweave', system: 'DND_5E', isPublic: true, ownerId: lucas.id,
        backstory: 'Um elfo mago errante que busca os segredos das runas antigas.',
        sheetData: {
          race: 'Elfo do Alto', class: 'Mago', subclass: 'Escola de Evocação', level: 7,
          attributes: { str: 8, dex: 14, con: 12, int: 18, wis: 13, cha: 10 },
          hp: { max: 44, current: 44 }, armorClass: 13, speed: 30, proficiencyBonus: 3,
          inventory: ['Grimório', 'Cajado Arcano', 'Bolsa de Componentes'],
        },
      },
      {
        name: 'Viktor Nacht', system: 'VAMPIRE_MASQUERADE', isPublic: false, ownerId: lucas.id,
        backstory: 'Um Ventrue de 200 anos que governa as sombras de Lisboa.',
        sheetData: {
          clan: 'Ventrue', generation: 8, nature: 'Lídico', demeanor: 'Arquiteto',
          disciplines: { dominate: 3, presence: 2, fortitude: 2 },
          bloodPool: { max: 15, current: 12 }, humanity: 6,
        },
      },
    ];

    for (const charData of characters) {
      const exists = await characterRepo.findOneBy({ name: charData.name, ownerId: lucas.id });
      if (!exists) {
        await characterRepo.save(characterRepo.create(charData));
        console.log(`  ✅ Personagem criado: ${charData.name}`);
      } else {
        console.log(`  ⚠️  Já existe: ${charData.name}`);
      }
    }

    // Campanha
    let campaign = await campaignRepo.findOneBy({ name: 'A Coroa das Trevas' });
    if (!campaign) {
      campaign = await campaignRepo.save(campaignRepo.create({
        name: 'A Coroa das Trevas',
        description: 'Uma aventura épica em Faerûn para recuperar a Coroa das Trevas.',
        system: 'DND_5E', gmId: lucas.id, inviteCode: 'CROWN01', maxPlayers: 5,
      }));
      console.log('  ✅ Campanha criada: A Coroa das Trevas');
    } else {
      console.log('  ⚠️  Já existe: A Coroa das Trevas');
    }

    // Personagem da Alice
    let aliceChar = await characterRepo.findOneBy({ name: 'Lyra Stoneheart', ownerId: alice.id });
    if (!aliceChar) {
      aliceChar = await characterRepo.save(characterRepo.create({
        name: 'Lyra Stoneheart', system: 'DND_5E', isPublic: true, ownerId: alice.id,
        backstory: 'Uma anã paladina determinada a proteger os inocentes.',
        sheetData: {
          race: 'Anã das Montanhas', class: 'Paladino', level: 5,
          attributes: { str: 17, dex: 10, con: 16, int: 10, wis: 13, cha: 14 },
          hp: { max: 55, current: 55 }, armorClass: 18,
        },
      }));
      console.log('  ✅ Personagem criado: Lyra Stoneheart (Alice)');
    } else {
      console.log('  ⚠️  Já existe: Lyra Stoneheart');
    }

    // Membership pendente da Alice
    const existingMembership = await membershipRepo.findOneBy({ campaignId: campaign.id, userId: alice.id });
    if (!existingMembership) {
      await membershipRepo.save(membershipRepo.create({
        campaignId: campaign.id, userId: alice.id, characterId: aliceChar.id,
        requestMessage: 'Olá! Adoro roleplay intenso e posso contribuir muito com o grupo!',
        status: 'PENDING',
      } as any));
      console.log('  ✅ Solicitação pendente da Alice criada.');
    } else {
      console.log('  ⚠️  Membership da Alice já existe.');
    }
  }

  await AppDataSource.destroy();
  console.log('\n✅ Todos os seeds finalizados!');
}

runAll().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
