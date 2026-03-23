const fs = require('fs');

const engObj = {
  saving: 'Saving...',
  saved: 'Saved!',
  saveSheet: 'Save Sheet',
  loading: 'LOADING SHEET...',
  backToDashboard: 'Dashboard',
  characterNamePlaceholder: 'Character Name',
  tabLabels: {
    overview: 'Overview',
    combat: 'Combat',
    skills: 'Skills',
    spells: 'Spells',
    inventory: 'Inventory',
    story: 'Story'
  },
  overview: {
    abilityScores: 'Ability Scores',
    coreStats: 'Core Stats',
    armorClass: 'Armor Class',
    initiative: 'Initiative',
    speed: 'Speed (ft)',
    profBonus: 'Prof. Bonus',
    passivePerception: 'Passive Percep.',
    inspiration: 'Inspiration',
    characterDetails: 'Character Details',
    race: 'Race',
    class: 'Class',
    subclass: 'Subclass',
    level: 'Level',
    background: 'Background',
    alignment: 'Alignment',
    xp: 'Experience Points',
    hitDice: 'Hit Dice',
    proficiencies: 'Proficiencies',
    proficienciesPlaceholder: 'Weapons, tools, armor types...',
    languages: 'Languages',
    languagesPlaceholder: 'Common, Elvish...',
    physicalAppearance: 'Physical Appearance',
    age: 'Age',
    height: 'Height',
    weight: 'Weight',
    eyes: 'Eyes',
    hair: 'Hair',
    skin: 'Skin'
  }
};

const ptObj = {
  saving: 'Salvando...',
  saved: 'Salvo!',
  saveSheet: 'Salvar Ficha',
  loading: 'CARREGANDO FICHA...',
  backToDashboard: 'Voltar ao Dashboard',
  characterNamePlaceholder: 'Nome do Personagem',
  tabLabels: {
    overview: 'Visão Geral',
    combat: 'Combate',
    skills: 'Perícias',
    spells: 'Magias',
    inventory: 'Inventário',
    story: 'História'
  },
  overview: {
    abilityScores: 'Valores de Habilidade',
    coreStats: 'Atributos Principais',
    armorClass: 'Classe de Armadura',
    initiative: 'Iniciativa',
    speed: 'Desloc. (ft)',
    profBonus: 'Bônus de Prof.',
    passivePerception: 'Percepção Passiva',
    inspiration: 'Inspiração',
    characterDetails: 'Detalhes do Personagem',
    race: 'Raça',
    class: 'Classe',
    subclass: 'Subclasse',
    level: 'Nível',
    background: 'Antecedente',
    alignment: 'Tendência',
    xp: 'Pontos de Experiência',
    hitDice: 'Dados de Vida',
    proficiencies: 'Proficiências',
    proficienciesPlaceholder: 'Armas, ferramentas, armaduras...',
    languages: 'Idiomas',
    languagesPlaceholder: 'Comum, Élfico...',
    physicalAppearance: 'Aparência Física',
    age: 'Idade',
    height: 'Altura',
    weight: 'Peso',
    eyes: 'Olhos',
    hair: 'Cabelo',
    skin: 'Pele'
  }
};

const enPath = './src/locales/en/character.json';
const ptPath = './src/locales/pt/character.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

Object.assign(enData, engObj);
Object.assign(ptData, ptObj);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(ptPath, JSON.stringify(ptData, null, 2));
