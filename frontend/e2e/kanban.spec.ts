import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe cargar la aplicacion y mostrar exactamente 5 columnas con datos de prueba', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Tablero Kanban');

    const columns = page.locator('section[aria-label^="Columna"]');
    await expect(columns).toHaveCount(5);

    // Verificar nombres de las 5 columnas iniciales
    await expect(page.locator('#column-title-col-1')).toHaveText('Por Hacer');
    await expect(page.locator('#column-title-col-2')).toHaveText('En Planificacion');
    await expect(page.locator('#column-title-col-3')).toHaveText('En Desarrollo');
    await expect(page.locator('#column-title-col-4')).toHaveText('En Revision');
    await expect(page.locator('#column-title-col-5')).toHaveText('Completado');

    // Verificar presencia de tarjetas de prueba
    await expect(page.locator('#task-title-task-1')).toContainText('Disenar interfaz de usuario');
  });

  test('debe permitir renombrar el titulo de una columna', async ({ page }) => {
    const editBtn = page.locator('#btn-edit-col-col-1');
    await editBtn.click();

    const input = page.locator('#edit-col-title-input-col-1');
    await input.fill('Backlog de Tareas');
    await input.press('Enter');

    await expect(page.locator('#column-title-col-1')).toHaveText('Backlog de Tareas');
  });

  test('debe permitir agregar una nueva tarjeta a una columna', async ({ page }) => {
    const openAddBtn = page.locator('#btn-open-add-task-col-1');
    await openAddBtn.click();

    await page.locator('#input-title-col-1').fill('Nueva Tarea de Prueba');
    await page.locator('#input-details-col-1').fill('Detalles explicativos de la nueva tarea');
    await page.locator('#btn-submit-add-col-1').click();

    await expect(page.getByText('Nueva Tarea de Prueba')).toBeVisible();
    await expect(page.getByText('Detalles explicativos de la nueva tarea')).toBeVisible();
  });

  test('debe permitir editar el titulo y los detalles de una tarjeta existente', async ({ page }) => {
    const editCardBtn = page.locator('#btn-edit-task-task-1');
    await editCardBtn.click();

    const titleInput = page.locator('#input-edit-title-task-1');
    const detailsInput = page.locator('#input-edit-details-task-1');
    const saveBtn = page.locator('#btn-save-edit-task-1');

    await titleInput.fill('Disenar interfaz de usuario actualizada');
    await detailsInput.fill('Detalles modificados correctamente.');
    await saveBtn.click();

    await expect(page.locator('#task-title-task-1')).toHaveText('Disenar interfaz de usuario actualizada');
    await expect(page.locator('#task-details-task-1')).toHaveText('Detalles modificados correctamente.');
  });

  test('debe permitir eliminar una tarjeta existente', async ({ page }) => {
    await expect(page.locator('#task-card-task-1')).toBeVisible();

    const deleteBtn = page.locator('#delete-task-task-1');
    await deleteBtn.click();

    await expect(page.locator('#task-card-task-1')).not.toBeVisible();
  });

  test('debe permitir arrastrar una tarjeta a otra columna usando interaccion o teclado', async ({ page }) => {
    const card = page.locator('#task-card-task-1');
    const targetCol = page.locator('#droppable-col-2');

    await expect(card).toBeVisible();

    // Obtener las coordenadas del elemento origen y destino
    const cardBox = await card.boundingBox();
    const targetBox = await targetCol.boundingBox();

    if (cardBox && targetBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    // Si el mouse drag no activa react-beautiful-dnd en headless, usar atajo accesibilidad por teclado
    const isMoved = await page.locator('#droppable-col-2 #task-card-task-1').isVisible();
    if (!isMoved) {
      await card.focus();
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Space');
    }

    await expect(page.locator('#droppable-col-2 #task-card-task-1')).toBeVisible();
  });
});
