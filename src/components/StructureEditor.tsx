import { useCallback, useRef } from 'react';
import type { CanvasEditorOnChangeMolecule } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

interface Props {
  /**
   * Initial SMILES used to seed the editor. The editor is uncontrolled —
   * changing this prop after mount will reset and reposition the molecule.
   * @default ''
   */
  initialSmiles?: string;
  /**
   * Called on every edit with the OCL idCode of the current molecule. The
   * idCode is the canonical, coordinate-free form — safe to compare with
   * `===` against an expected answer.
   */
  onChange: (idCode: string) => void;
  /** Editor height in pixels. Defaults to 460. */
  height?: number;
}

/**
 * Wrap react-ocl's CanvasMoleculeEditor so the parent component receives a
 * stable canonical idCode (no coordinates) on every change — the format
 * the validator expects.
 * @param props - Initial structure + change callback.
 * @param props.initialSmiles - SMILES used to seed the editor.
 * @param props.onChange - Called with the canonical idCode on every edit.
 * @param props.height - Editor height in pixels.
 * @returns The editor inside a styled container.
 */
export function StructureEditor({
  initialSmiles = '',
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

  return (
    <div className="structure-editor" style={{ height }}>
      <CanvasMoleculeEditor
        inputFormat="smiles"
        inputValue={initialSmiles}
        onChange={handleChange}
      />
    </div>
  );
}
