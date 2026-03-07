export default function FeaturesSection() {
  const features = [
    {
      title: 'Character Sheets',
      description: 'Create and manage heroes with an intuitive digital system. Built to support the mechanics you already know and love.',
      icon: '📝'
    },
    {
      title: 'World & Lore',
      description: 'Record the history of cities, gods, and NPCs. Build a private wiki so your table never forgets the details.',
      icon: '🗺️'
    },
    {
      title: 'Library & Homebrew',
      description: 'No more searching for lost PDFs. Organize your house rules, custom spells, and magical items in a single collection.',
      icon: '📚'
    },
    {
      title: 'Campaign Gallery',
      description: 'Upload battle maps, character portraits, and DM screens to set the perfect mood for your sessions.',
      icon: '🖼️'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Everything your table needs.</h2>
          <p>
            More than just a character builder. RP Hub is the vault where Game Masters and 
            Players store the soul of their campaigns, 100% free.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
