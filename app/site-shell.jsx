import LegacyRuntime from './legacy-runtime';
import PageToggle from './page-toggle';

export default function SiteShell() {
  const showEditControls = process.env.NEXT_PUBLIC_MWTH_SHOW_EDIT_CONTROLS === 'true';

  return (
    <>
      <div id="root" />

      <PageToggle />

      {showEditControls && (
        <div className="tweaks" id="tweaks">
          <h3>Display</h3>
          <div className="t-row">
            <span className="t-lbl">Opening</span>
            <div className="seg" data-key="hero">
              <button data-val="A" className="on">Split</button>
              <button data-val="B">Cover</button>
            </div>
          </div>
          <div className="t-row">
            <span className="t-lbl">Palette</span>
            <div className="seg" data-key="palette">
              <button data-val="cream" className="on">Cream</button>
              <button data-val="stone">Stone</button>
              <button data-val="ivory">Ivory</button>
            </div>
          </div>
          <div className="t-row">
            <span className="t-lbl">Masthead</span>
            <div className="seg" data-key="masthead">
              <button data-val="editorial" className="on">Editorial</button>
              <button data-val="minimal">Minimal</button>
            </div>
          </div>
        </div>
      )}

      <LegacyRuntime />
    </>
  );
}
