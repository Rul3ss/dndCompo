import { AppDataSource } from '../data-source';

async function seed() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('🌱 Seed de personagens e campanhas...');

  const userRepo = AppDataSource.getRepository('User');
  const characterRepo = AppDataSource.getRepository('Character');
  const campaignRepo = AppDataSource.getRepository('Campaign');
  const membershipRepo = AppDataSource.getRepository('CampaignMembership');

  // Pega usuários existentes
  const lucas = await userRepo.findOneBy({ email: 'teste@email.com' });
  const alice = await userRepo.findOneBy({ email: 'alice@email.com' });

  if (!lucas || !alice) {
    console.log('⚠️  Usuários não encontrados. Rode o seed de usuários primeiro.');
    await AppDataSource.destroy();
    return;
  }

  // --- Personagens do Lucas ---
  const characters = [
    {
      name: 'Eldrin Lightweave',
      system: 'DND_5E',
      backstory: 'Um elfo mago errante que busca os segredos das runas antigas.',
      isPublic: true,
      ownerId: lucas.id,
      sheetData: {
        race: 'Elfo do Alto',
        class: 'Mago',
        subclass: 'Escola de Evocação',
        level: 7,
        attributes: { str: 8, dex: 14, con: 12, int: 18, wis: 13, cha: 10 },
        hp: { max: 44, current: 44 },
        armorClass: 13,
        speed: 30,
        proficiencyBonus: 3,
        savingThrows: { int: true, wis: true },
        skills: { arcana: true, history: true, investigation: true },
        spellSlots: { 1: 4, 2: 3, 3: 3, 4: 1 },
        inventory: ['Grimório', 'Cajado Arcano', 'Bolsa de Componentes'],
        languages: ['Comum', 'Élfico', 'Dracônico'],
      },
    },
    {
      name: 'Viktor Nacht',
      system: 'VAMPIRE_MASQUERADE',
      backstory: 'Um Ventrue de 200 anos que governa as sombras de Lisboa.',
      isPublic: false,
      ownerId: lucas.id,
      sheetData: {
        clan: 'Ventrue',
        generation: 8,
        nature: 'Lídico',
        demeanor: 'Arquiteto',
        attributes: {
          strength: 3, dexterity: 2, stamina: 3,
          charisma: 4, manipulation: 4, appearance: 3,
          perception: 2, intelligence: 4, wits: 3,
        },
        abilities: {
          leadership: 4, intimidation: 3, finance: 3, law: 2,
        },
        disciplines: { dominate: 3, presence: 2, fortitude: 2 },
        bloodPool: { max: 15, current: 12 },
        humanity: 6,
        willpower: { max: 8, current: 8 },
      },
    },
  ];

  for (const charData of characters) {
    const exists = await characterRepo.findOneBy({ name: charData.name, ownerId: lucas.id });
    if (!exists) {
      const character = characterRepo.create(charData);
      await characterRepo.save(character);
      console.log(`✅ Personagem criado: ${charData.name}`);
    } else {
      console.log(`⚠️  Personagem já existe: ${charData.name}`);
    }
  }

  // --- Campanha do Lucas como GM ---
  let campaign = await campaignRepo.findOneBy({ name: 'A Coroa das Trevas' });
  if (!campaign) {
    campaign = campaignRepo.create({
      name: 'A Coroa das Trevas',
      description: 'Uma aventura épica no mundo de Faerûn, onde os heróis devem recuperar a Coroa das Trevas antes que o Lich a use para despertar um exército morto-vivo.',
      system: 'DND_5E',
      gmId: lucas.id,
      inviteCode: 'CROWN01',
      maxPlayers: 5,
    });
    await campaignRepo.save(campaign);
    console.log('✅ Campanha criada: A Coroa das Trevas');
  } else {
    console.log('⚠️  Campanha já existe: A Coroa das Trevas');
  }

  // --- Personagem da Alice para solicitar entrada ---
  let aliceChar = await characterRepo.findOneBy({ name: 'Lyra Stoneheart', ownerId: alice.id });
  if (!aliceChar) {
    aliceChar = characterRepo.create({
      name: 'Lyra Stoneheart',
      system: 'DND_5E',
      backstory: 'Uma anã paladina determinada a proteger os inocentes a qualquer custo.',
      isPublic: true,
      ownerId: alice.id,
      sheetData: {
        race: 'Anã das Montanhas',
        class: 'Paladino',
        subclass: 'Juramento de Devoção',
        level: 5,
        attributes: { str: 17, dex: 10, con: 16, int: 10, wis: 13, cha: 14 },
        hp: { max: 55, current: 55 },
        armorClass: 18,
        speed: 25,
        proficiencyBonus: 3,
      },
    });
    await characterRepo.save(aliceChar);
    console.log('✅ Personagem criado: Lyra Stoneheart (Alice)');
  }

  // --- Membership pendente da Alice na campanha ---
  const existingMembership = await membershipRepo.findOneBy({
    campaignId: campaign.id,
    userId: alice.id,
  });
  if (!existingMembership) {
    const membership = membershipRepo.create({
      campaignId: campaign.id,
      userId: alice.id,
      characterId: aliceChar.id,
      requestMessage: 'Olá! Sou experiente em campanhas de D&D 5e e adoro roleplay intenso. Posso contribuir muito com o grupo!',
      status: 'PENDING',
    } as any);
    await membershipRepo.save(membership);
    console.log('✅ Solicitação pendente da Alice criada na campanha.');
  } else {
    console.log('⚠️  Membership da Alice já existe.');
  }

  await AppDataSource.destroy();
  console.log('🎲 Seed de personagens e campanhas finalizado!');
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
