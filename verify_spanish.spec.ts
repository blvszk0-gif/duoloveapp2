import { test, expect } from '@playwright/test';

test('verify spanish lessons', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('text=DuoLove');

  // Click Spanish button
  await page.click('button:has-text("Hiszpański")');

  // Check if Spanish categories appear
  await expect(page.locator('text=Hiszpański - Codzienne')).toBeVisible();
  await expect(page.locator('text=Hiszpański - Lekcja 1')).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'verification/spanish_lessons.png', fullPage: true });
});
