import type { CSSProperties } from "react";
import { ArrowDownRight } from "lucide-react";
import "./kinetic-manifesto.css";

const echoDepths = [1, 2, 3, 4];

function TypePlane({ text, className }: { text: string; className: string }) {
  return (
    <div className={`manifesto-plane ${className}`} aria-hidden="true">
      <div className="manifesto-type-stack">
        {echoDepths.map((depth) => (
          <span
            className="manifesto-type manifesto-echo"
            style={{ "--echo-depth": depth } as CSSProperties}
            key={depth}
          >
            {text}
          </span>
        ))}
        <span className="manifesto-type manifesto-face">{text}</span>
      </div>
    </div>
  );
}

/**
 * The page's central motion hook enhances this static composition. It owns
 * data-enhanced, all transforms, and the pin; this component owns no animation.
 */
export function KineticManifesto() {
  return (
    <section
      id="creative"
      className="manifesto-stage"
      aria-labelledby="kinetic-manifesto-title"
    >
      <h2 id="kinetic-manifesto-title" className="sr-only">
        Useful. Unexpected.
      </h2>
      <div className="manifesto-pin">
        <p className="manifesto-intro">An interface should do more than sit there.</p>
        <div className="manifesto-space">
          <TypePlane text="FEEL IT." className="manifesto-question" />
          <TypePlane text="BUILD IT." className="manifesto-answer" />
          <div className="manifesto-plane manifesto-final">
            <p className="manifesto-statement" aria-hidden="true">
              <span className="manifesto-make">USEFUL.</span>
              <span className="manifesto-feel">UNEXPECTED.</span>
            </p>
            <a className="manifesto-link" href="#playground">
              Try it for yourself
              <ArrowDownRight size={21} strokeWidth={1.4} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
