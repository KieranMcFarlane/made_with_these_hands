const pages = [
  ['home', 'Home'],
  ['shop', 'Objects'],
  ['product', 'Product'],
  ['maker', 'Maker'],
  ['craft', 'Craft'],
  ['hugh', 'Hugh'],
  ['blog', 'Blog'],
  ['artists', 'Artists'],
  ['podcasts', 'Podcasts'],
  ['episode', 'Episode'],
  ['commissions', 'Commissions'],
];

export default function PageToggle() {
  return (
    <div className="page-toggle" id="pageToggle">
      {pages.map(([page, label]) => (
        <a
          key={page}
          href={`/?page=${page}`}
          data-page={page}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
