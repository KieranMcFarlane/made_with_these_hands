import LegacyRuntime from './legacy-runtime';
import PageToggle from './page-toggle';

export default function Home() {
  return (
    <>
      <div id="root" />

      <PageToggle />

      <div className="tweaks" id="tweaks">
        <h3>Tweaks</h3>
        <div className="t-row">
          <span className="t-lbl">Hero variant</span>
          <div className="seg" data-key="hero">
            <button data-val="A" className="on">A · Split</button>
            <button data-val="B">B · Cover</button>
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

      <LegacyRuntime />
    </>
  );
}
