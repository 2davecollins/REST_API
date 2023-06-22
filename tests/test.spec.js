import { test, expect } from "@playwright/test";

test("button test", async ({ page }) => {
  await page.goto("http://localhost:4000/api-docs/");
  await expect(page).toHaveTitle("Swagger UI");
  await page.getByRole("button", { name: "get ​/books", exact: true }).click();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page.getByRole("button", { name: "Execute" }).click();
  await page.getByRole("button", { name: "get ​/books​/{id}" }).click();
  await page.getByRole("button", { name: "Try it out" }).click();
  await page.getByPlaceholder("id").fill("2");
  await page
    .locator("#operations-Books-get_books__id_")
    .getByRole("button", { name: "Execute" })
    .click();
});
