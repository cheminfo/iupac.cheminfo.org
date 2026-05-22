import { SmilesSvgRenderer } from 'react-ocl';

interface Props {
  /** Canonical SMILES to render. When empty, an "empty" placeholder is shown. */
  smiles?: string;
  /**
   * Width in pixels of the rendered SVG.
   * @default 360
   */
  width?: number;
  /**
   * Height in pixels of the rendered SVG.
   * @default 240
   */
  height?: number;
  /** Visual label shown above the structure. Optional. */
  caption?: string;
}

/**
 * Render a 2D molecular structure from a SMILES string. Falls back to an
 * "empty" placeholder when no SMILES is supplied so callers can pass
 * possibly-undefined values without conditional wrappers.
 * @param props - SMILES + sizing.
 * @param props.smiles - The SMILES to render.
 * @param props.width - SVG width in pixels.
 * @param props.height - SVG height in pixels.
 * @param props.caption - Optional caption shown above the structure.
 * @returns The SVG renderer wrapped in a card-style container.
 */
export function StructureDisplay({
  smiles,
  width = 360,
  height = 240,
  caption,
}: Props) {
  return (
    <div className="structure-display">
      {smiles ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'center',
          }}
        >
          {caption && (
            <div className="muted" style={{ fontSize: 12 }}>
              {caption}
            </div>
          )}
          <SmilesSvgRenderer smiles={smiles} width={width} height={height} />
        </div>
      ) : (
        <div className="structure-empty">No structure to display.</div>
      )}
    </div>
  );
}
