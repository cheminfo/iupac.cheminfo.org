import { expect, test } from '@playwright/test';

test('home page loads with the tutorial tab', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/IUPAC Playground/);
  await expect(page.getByRole('tab', { name: 'Tutorial' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Guided tour' }),
  ).toBeVisible();
});

test('tutorial navigation moves between steps', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Carbon counts/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(
    page.getByRole('heading', { name: /Locants and prefixes/ }),
  ).toBeVisible();
});

test('switching tabs renders the cheatsheet', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Cheatsheet' }).click();
  await expect(
    page.getByRole('heading', { name: 'Cheatsheet' }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Functional groups' }),
  ).toBeVisible();
});

test('exercises page lists at least one exercise and grades a typed name', async ({
  page,
}) => {
  await page.goto('/#/exercises');
  const firstExerciseButton = page.getByTestId('exercise-button').first();
  await expect(firstExerciseButton).toBeVisible();

  // Navigate to a known structure-to-name exercise by id (cyclohexane → "cyclohexane").
  await page.goto('/#/exercises/stn:9podb2');
  const answerInput = page.getByTestId('answer-name');
  await expect(answerInput).toBeVisible();
  await answerInput.fill('cyclohexane');
  await expect(
    page.getByRole('heading', { name: /Brilliant! Exercise solved/ }),
  ).toBeVisible();
});

test('share-series dialog produces a URL with a series token', async ({
  page,
}) => {
  await page.goto('/#/exercises');
  await page
    .getByRole('button', { name: 'Share a custom series' })
    .click();
  const shareUrl = page.getByTestId('share-url');
  await expect(shareUrl).toBeVisible();
  const value = await shareUrl.inputValue();
  expect(value).toMatch(/\?series=[\w-]+#\/exercises/);
});
