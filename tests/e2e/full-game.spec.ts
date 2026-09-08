import { expect, test } from '@playwright/test';

test('a new player can solve the complete case and open the gift', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/');

  await page.getByRole('button', { name: /Comenzar investigación/i }).click();
  await page.getByRole('button', { name: /Bosque norte/i }).first().click();
  await page.getByRole('button', { name: /Examinar la fotografía/i }).click();
  await page.getByRole('button', { name: /Examinar la relación/i }).click();
  await page.getByRole('button', { name: /Existe otra vía de entrada/i }).click();
  await page.getByRole('button', { name: /Interrogar a Hugo/i }).last().click();

  for (const question of [
    '¿Qué escuchaste durante el apagón?',
    '¿Viste a alguien utilizar la puerta lateral?',
    'Esta fotografía muestra otro acceso. ¿El ruido prueba que se utilizó?',
  ]) await page.getByRole('button', { name: question, exact: true }).click();
  await page.getByRole('button', { name: 'Registrar testimonio', exact: true }).click();
  await page.getByRole('button', { name: /Inspeccionar el acceso lateral/i }).click();

  await page.getByRole('button', { name: /Iniciar inspección/i }).click();
  await page.getByRole('button', { name: 'El umbral y el suelo', exact: true }).click();
  await page.getByRole('button', { name: /Continuar a los establos/i }).click();
  await page.getByRole('button', { name: /Iniciar inspección/i }).click();
  await page.getByRole('button', { name: 'El suelo junto al paso', exact: true }).click();
  await page.getByRole('button', { name: /Relacionar las pruebas/i }).click();
  await page.getByRole('button', { name: /compatibles con un recorrido exterior/i }).click();
  await page.getByRole('button', { name: /Entrar en la casa/i }).first().click();

  const roomEvidence = [
    ['Salón', 'El reloj de pared'],
    ['Cocina / Comedor', 'El servicio de mesa'],
    ['Pasillo', 'El suelo junto al zócalo'],
    ['Habitación de Samuel', 'Los papeles del escritorio'],
  ] as const;
  for (const [room, evidence] of roomEvidence) {
    await page.getByRole('button', { name: `Entrar en ${room}`, exact: true }).click();
    await page.getByRole('button', { name: /Iniciar inspección/i }).click();
    await page.getByRole('button', { name: evidence, exact: true }).click();
  }
  await page.getByRole('button', { name: /Relacionar las siete pruebas/i }).click();
  await expect(page.getByRole('img', { name: /Panel original con las siete pruebas/i })).toBeVisible();
  await page.getByRole('button', { name: /hora del reloj cae dentro del apagón/i }).click();
  await page.getByRole('button', { name: /Personas del caso/i }).click();

  for (const witness of ['Daniel González', 'Karalee Rhuman', 'María Gómez', 'Inés Robles', 'Verónica Benítez', 'Javier López', 'María Alejandra', 'Jhonatan Vaca', 'Jairo Varela']) {
    await page.getByRole('button', { name: new RegExp(witness) }).click();
    await page.getByRole('button', { name: 'Registrar declaración', exact: true }).click();
  }
  await page.getByRole('button', { name: /Confrontar a Inés/i }).first().click();
  await page.getByRole('button', { name: /Vaso de agua sin terminar/i }).click();
  await expect(page.getByText(/no puede atribuirse a ninguna persona/i)).toBeVisible();
  for (const evidence of [/Declaración de Daniel/i, /Mensaje a María/i, /Recorrido exterior/i]) await page.getByRole('button', { name: evidence }).click();
  await expect(page.getByRole('heading', { name: /ha cambiado dos veces/i })).toBeVisible();
  await page.getByRole('button', { name: /Reconstruir la noche/i }).click();
  await page.getByRole('button', { name: /Samuel citó a alguien por los documentos/i }).click();

  await page.getByRole('radio', { name: 'Inés Robles', exact: true }).click();
  await page.getByRole('radio', { name: 'Una discusión terminó en una caída fatal.', exact: true }).click();
  await page.getByRole('radio', { name: 'Se marchó por la puerta lateral sin pedir ayuda.', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar acusación', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Acusación correcta' })).toBeVisible();
  await page.getByRole('button', { name: /Abrir el regalo de Laura/i }).click();
  await page.getByRole('button', { name: 'Abrir el sobre', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Una noche diferente en Madrid.' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Invitación de Laura/i })).toBeVisible();
});
