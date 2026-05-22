import { useCallback, useRef } from 'react';
import type { CanvasEditorOnChangeMolecule } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

interface Props {
  /**
   * Initial SMILES used to seed the editor. Ignored when `initialMolfile`
   * is provided. The editor is uncontrolled — changing this prop after
   * mount will reset and reposition the molecule.
   * @default ''
   */
  initialSmiles?: string;
  /**
   * Initial molfile used to seed the editor. Takes precedence over
   * `initialSmiles` when both are set. Preserves the 2D coordinates baked
   * into the molfile (e.g. the layout returned by openmolecules.org).
   * @default undefined
   */
  initialMolfile?: string;
  /**
   * Called on every edit with the OCL idCode of the current molecule. The
   * idCode is the canonical, coordinate-free form — safe to compare with
   * `===` against an expected answer.
   */
  onChange: (idCode: string) => void;
  /**
   * Editor height in pixels.
   * @default 460
   */
  height?: number;
}

/**
 * Wrap react-ocl's CanvasMoleculeEditor so the parent component receives a
 * stable canonical idCode (no coordinates) on every change — the format
 * the validator expects.
 * @param props - Initial structure + change callback.
 * @param props.initialSmiles - SMILES used to seed the editor.
 * @param props.initialMolfile - Molfile used to seed the editor (preferred when set).
 * @param props.onChange - Called with the canonical idCode on every edit.
 * @param props.height - Editor height in pixels.
 * @returns The editor inside a styled container.
 */
export function StructureEditor({
  initialSmiles = '',
  initialMolfile,
  onChange,
  height = 460,
}: Props) {
  const lastIdCodeRef = useRef<string>('');

  const handleChange = useCallback(
    (event: CanvasEditorOnChangeMolecule) => {
      const fullIdcode = event.getIdcode();
      const [idCodeOnly] = fullIdcode.split(' ');
      const canonical = idCodeOnly ?? '';
      if (canonical === lastIdCodeRef.current) return;
      lastIdCodeRef.current = canonical;
      onChange(canonical);
    },
    [onChange],
  );

  const useMolfile = initialMolfile !== undefined && initialMolfile !== '';

  return (
    <div className="structure-editor" style={{ height }}>
      <CanvasMoleculeEditor
        inputFormat={useMolfile ? 'molfile' : 'smiles'}
        inputValue={useMolfile ? initialMolfile : initialSmiles}
        onChange={handleChange}
      />
    </div>
  );
}
