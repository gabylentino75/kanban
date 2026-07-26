# Kanban Board MVP

Aplicacion web estilo Kanban de tablero unico implementada con Next.js (App Router), TypeScript y Tailwind CSS.

## Requisitos y Caracteristicas
- Tablero unico con 5 columnas fijas renombrables.
- Tarjetas con titulo y detalles editable en el lugar.
- Interfaz de arrastrar y soltar (Drag and Drop) con @hello-pangea/dnd.
- Adicion y eliminacion de tarjetas.
- Estado en memoria (sin persistencia en base de datos).
- Cero emojis en codigo y documentacion.

## Instalacion y Ejecucion

Navegar a la carpeta frontend:
```bash
cd frontend
npm install
npm run dev
```

Abra http://localhost:3000 en el navegador.

## Pruebas E2E (Playwright)

Ejecutar las pruebas de integracion:
```bash
cd frontend
npx playwright test
```
