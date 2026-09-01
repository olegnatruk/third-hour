import { cn } from "@/lib/cn";

type CoffeePourLoaderProps = {
  /** A short, visible status so the wait feels purposeful. */
  label?: string;
  className?: string;
};

/**
 * Third Hour's signature loading scene: a gooseneck kettle pours into a cup
 * that responds with crema, ripples, and a small bounce. It is all SVG + CSS
 * so route fallbacks stay immediate and require no client-side work.
 */
export function CoffeePourLoader({
  label = "Brewing your next page",
  className,
}: CoffeePourLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("coffee-loader", className)}
    >
      <svg
        viewBox="0 0 200 192"
        className="coffee-loader__art"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse cx="102" cy="166" rx="62" ry="11" className="coffee-loader__shadow" />

        <g className="coffee-loader__pot">
          <path
            d="M34 39C34 33.5 38.5 29 44 29H101C107.6 29 113 34.4 113 41V67C113 73.6 107.6 79 101 79H46C39.4 79 34 73.6 34 67V39Z"
            className="coffee-loader__pot-body"
          />
          <path d="M50 29C50 17.8 59.2 9 70.5 9C81.8 9 91 17.8 91 29" className="coffee-loader__line" />
          <path d="M45 48H101" className="coffee-loader__pot-detail" />
          <path d="M113 45C126 47 137 54 144 63L122 70" className="coffee-loader__line" />
          <path d="M99 25C99 20.6 102.6 17 107 17" className="coffee-loader__line" />
          <circle cx="107" cy="17" r="2.4" className="coffee-loader__lid-dot" />
        </g>

        <path d="M144 62C144 82 114 87 114 108" className="coffee-loader__stream" />
        <path d="M148 65C148 84 121 92 121 108" className="coffee-loader__stream coffee-loader__stream--thin" />

        <g className="coffee-loader__cup-group">
          <path d="M139 112C154 110 162 118 162 130C162 142 153 149 141 146" className="coffee-loader__handle" />
          <path
            d="M58 104H143L136 145C135.3 150.8 130.4 155 124.5 155H76.5C70.6 155 65.7 150.8 65 145L58 104Z"
            className="coffee-loader__cup"
          />
          <path
            d="M64 121H137L133 144C132.5 147.4 129.6 150 126.2 150H74.8C71.4 150 68.5 147.4 68 144L64 121Z"
            className="coffee-loader__coffee"
          />
          <path d="M64 121C78 117.5 124 117.5 137 121" className="coffee-loader__crema" />
          <path d="M58 104C80 99 121 99 143 104" className="coffee-loader__rim" />
          <path d="M77 173C89 176 119 176 132 173" className="coffee-loader__saucer" />
          <path d="M69 163C84 167 121 167 136 163" className="coffee-loader__saucer coffee-loader__saucer--inner" />
        </g>

        <circle cx="117" cy="104" r="3" className="coffee-loader__drop coffee-loader__drop--one" />
        <circle cx="126" cy="106" r="2" className="coffee-loader__drop coffee-loader__drop--two" />
        <path d="M104 108C100 102 98 100 94 98" className="coffee-loader__splash coffee-loader__splash--left" />
        <path d="M132 108C137 102 140 100 144 99" className="coffee-loader__splash coffee-loader__splash--right" />

        <path d="M81 93C77 87 79 81 84 76" className="coffee-loader__steam" />
        <path d="M98 92C94 85 97 79 101 74" className="coffee-loader__steam coffee-loader__steam--late" />
        <path d="M115 93C111 87 113 82 118 77" className="coffee-loader__steam coffee-loader__steam--later" />
      </svg>
      <span className="coffee-loader__label">{label}</span>
    </div>
  );
}
