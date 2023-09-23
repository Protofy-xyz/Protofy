import { ColorProp } from "tamagui";

export const ProtofyLogoSVG = ({color, ...props}: {color?:ColorProp} & React.SVGProps<SVGSVGElement>) => (
  <svg width={600} height={652.32} id="Capa_1" data-name="Capa 1" viewBox="0 0 600 652.32" {...props}>
      <defs>
          <style>
              {`.cls-1 {
                  fill: none;
              }`}

              {`.cls-2 {
                  clip-path: url(#clip-path);
              }`}

              {`.cls-3 {
                  fill-rule: evenodd;
              }`}
          </style>
          <clipPath id="clip-path">
              <rect className="cls-1" width="600" height="652.32" />
          </clipPath>
      </defs>
      <g fill="var(--colorHover)" className="cls-2">
          <path className="cls-3"
              d="M315.78,134.26h0l158.65,91.6v200.6L300.7,526.76,127,426.46V225.86L300.7,125.55Zm0,199.53v56.77H285.63V333.32L238,306.75l14.69-26.33,48.54,27,47.46-27,14.86,26.23ZM300.7,160.36l-143.58,82.9V409.05L300.7,492l143.59-82.9V243.26Z" />
      </g>
  </svg>
  )

  
  