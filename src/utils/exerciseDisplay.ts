import type { FunctionalKey } from '../data/molecules.ts';
import type { ExerciseLevel, ExerciseStatus } from '../types.ts';

type Intent = 'success' | 'warning' | 'danger' | 'primary' | 'none';

/**
 * BlueprintJS intent associated with each pedagogic level. Reused by the
 * exercise list, the active-exercise header and any tag that surfaces level.
 */
export const LEVEL_INTENT: Record<ExerciseLevel, Intent> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
};

interface StatusDisplay {
  icon: 'tick-circle' | 'warning-sign' | 'circle';
  intent: Intent;
  className: string;
}

/**
 * Visual representation for each exercise status (icon, BlueprintJS intent
 * and CSS class used by the menu button).
 */
export const STATUS_DISPLAY: Record<ExerciseStatus, StatusDisplay> = {
  solved: { icon: 'tick-circle', intent: 'success', className: 'is-solved' },
  attempted: {
    icon: 'warning-sign',
    intent: 'warning',
    className: 'is-attempted',
  },
  idle: { icon: 'circle', intent: 'none', className: '' },
};

/**
 * Human-readable label for each functional / structural tag. Used in
 * tag chips on the exercise menu and in the teacher-share dialog.
 */
export const TAG_LABEL: Record<FunctionalKey, string> = {
  trivial: 'trivial',
  stereochemistry: 'stereo',
  cyclo: 'cyclo',
  alcane: 'alkane',
  alcene: 'alkene',
  alcyne: 'alkyne',
  aromatic: 'aromatic',
  alcohol: 'alcohol',
  ketone: 'ketone',
  carboxylicAcid: 'carboxylic acid',
  halogen: 'halogen',
  nitrile: 'nitrile',
  amine: 'amine',
  ether: 'ether',
  aldehyde: 'aldehyde',
  ester: 'ester',
  amide: 'amide',
  imine: 'imine',
  anhydride: 'anhydride',
  thiol: 'thiol',
  heterocyclic: 'heterocycle',
  other: 'other',
};

/**
 * Short label for each exercise kind (used on the menu chip and the
 * page title).
 */
export const KIND_LABEL = {
  'name-to-structure': 'draw',
  'structure-to-name': 'name',
} as const;
