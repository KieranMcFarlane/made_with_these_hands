const pages = [
  ['home', 'Home'],
  ['shop', 'Shop'],
  ['product', 'Product'],
  ['hugh', 'Hugh'],
  ['artists', 'Artists'],
  ['episode', 'Episode'],
  ['commissions', 'Commissions'],
  ['checkout', 'Checkout'],
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
