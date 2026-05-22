import { Button, ButtonGroup, Callout, Card, H4 } from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import { GlossaryDescription } from '../components/GlossaryTooltip.tsx';
import { StructureDisplay } from '../components/StructureDisplay.tsx';
import { MOLECULES } from '../data/molecules.generated.ts';
import type { Molecule } from '../data/molecules.ts';
import { TUTORIAL_LEVELS, TUTORIAL_STEPS } from '../data/tutorial.ts';
import type { TutorialStep } from '../types.ts';

const MOLECULE_BY_ID = new Map<string, Molecule>(
  MOLECULES.map((molecule) => [molecule.id, molecule]),
);

/**
 * Resolve the SMILES and IUPAC name shown for a tutorial step. Honours
 * `customSmiles` / `customName` overrides, then falls back to the
 * referenced molecule from the catalogue.
 * @param step - The step to resolve.
 * @returns The structure + display name (or empty strings when unknown).
 */
function resolveStep(step: TutorialStep): { smiles: string; name: string } {
  const fromCatalogue = MOLECULE_BY_ID.get(step.moleculeId);
  return {
    smiles: step.customSmiles ?? fromCatalogue?.smiles ?? '',
    name: step.customName ?? fromCatalogue?.name ?? '',
  };
}

/**
 * Guided tour through IUPAC nomenclature. Each step shows the structure
 * (rendered from a real SMILES) and a short paragraph with `[[term]]`
 * markers that resolve to the glossary tooltips on hover.
 * @returns The tutorial page.
 */
export function Tutorial() {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = TUTORIAL_STEPS[stepIndex] ?? TUTORIAL_STEPS[0];
  const resolved = useMemo(
    () => (currentStep ? resolveStep(currentStep) : { smiles: '', name: '' }),
    [currentStep],
  );
  if (!currentStep) {
    return <Card>No tutorial steps configured.</Card>;
  }

  function goToStep(index: number) {
    if (index < 0 || index >= TUTORIAL_STEPS.length) return;
    setStepIndex(index);
  }

  return (
    <div className="section-stack">
      <Card elevation={1}>
        <H4>Guided tour</H4>
        <p style={{ marginTop: 0 }} className="muted">
          Walk through the lessons step by step. Each step shows a real molecule
          and a short paragraph explaining the naming choice. Hover the
          underlined terms for a quick definition.
        </p>
        <div className="tutorial-levels">
          {TUTORIAL_LEVELS.map((meta) => {
            const stepsForLevel = TUTORIAL_STEPS.map((step, index) => ({
              step,
              index,
            })).filter(({ step }) => step.level === meta.level);
            return (
              <div
                key={meta.level}
                className="tutorial-level"
                style={{ background: meta.background }}
              >
                <span className="tutorial-level-label">{meta.label}</span>
                <div className="tutorial-level-buttons">
                  {stepsForLevel.map(({ step, index }) => {
                    const isActive = index === stepIndex;
                    return (
                      <Button
                        key={step.title}
                        size="small"
                        onClick={() => {
                          goToStep(index);
                        }}
                        title={step.title}
                        style={{
                          background: isActive
                            ? meta.activeBackground
                            : 'white',
                          fontWeight: isActive ? 700 : 500,
                          border: isActive
                            ? '1px solid #5c7080'
                            : '1px solid #d3d8de',
                        }}
                        text={String(index + 1)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <ButtonGroup>
            <Button
              icon="arrow-left"
              onClick={() => {
                goToStep(stepIndex - 1);
              }}
              disabled={stepIndex === 0}
              text="Previous"
            />
            <Button
              endIcon="arrow-right"
              intent="primary"
              onClick={() => {
                goToStep(stepIndex + 1);
              }}
              disabled={stepIndex >= TUTORIAL_STEPS.length - 1}
              text="Next"
            />
          </ButtonGroup>
        </div>
      </Card>

      <Callout intent="primary" icon="info-sign" title={currentStep.title}>
        <GlossaryDescription description={currentStep.description} />
      </Callout>

      <div className="split">
        <Card elevation={1}>
          <H4>Structure</H4>
          <StructureDisplay smiles={resolved.smiles} />
        </Card>
        <Card elevation={1}>
          <H4>IUPAC name</H4>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              padding: '40px 12px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {resolved.name}
          </div>
        </Card>
      </div>
    </div>
  );
}
