# DevChallenge — Quiz Educativo Interactivo

Juego de preguntas sobre desarrollo web (JavaScript y CSS) con temporizador, puntuación por velocidad, sonidos de feedback y persistencia de historial.

**Proyecto Personal — IF7102 Multimedios, UCR | I Ciclo 2026**

## Stack

| Tecnología | Uso |
|------------|-----|
| **Vue 3** | Framework principal, Composition API con `<script setup>` |
| **TypeScript** | Tipado estático para stores, composables y componentes |
| **Vite** | Bundler y dev server |
| **Pinia** | Estado global del juego |
| **Tailwind CSS v4** | Estilos utilitarios, tema oscuro |

## Requisitos del proyecto

- [x] Al menos 4 componentes reutilizables (16 componentes: 3 pantallas + 13 UI)
- [x] Datos cargados desde JSON con `fetch()` (`public/questions.json`, 18 preguntas)
- [x] Responsividad (mobile-first, Tailwind breakpoints)
- [x] Efectos de sonido: aciertos, errores y resultado (5 clips MP3)
- [x] REFERENCIAS.md documentando el proceso de aprendizaje
- [x] Historial de partidas persistido en localStorage

## Cómo ejecutar

### Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [pnpm](https://pnpm.io/) (activar con `corepack enable pnpm` incluido en Node.js 18+)

### Instalación

```bash
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

La aplicación se abre en `http://localhost:5173`.

### Build de producción

```bash
pnpm build
pnpm preview
```

## Cómo jugar

1. **Pantalla de inicio**: elegí cuántas preguntas (5, 10 o 15) y presioná **Comenzar** o apretá `Enter`.
2. **Pantalla de juego**: cada pregunta tiene 4 opciones. Respondé con teclas `1-4` o haciendo clic. Cuanto más rápido respondas, más puntos ganás.
3. **Pantalla de resultado**: revisá tus aciertos, tiempo promedio y mejor racha. Expansión de explicaciones para aprender de los errores.

## Estructura del proyecto

```
src/
├── components/
│   ├── screens/         # StartScreen, GameScreen, ResultScreen
│   └── ui/              # 13 componentes reutilizables (botones, timer, etc.)
├── composables/         # 11 composables (lógica del juego, timer, sonido, etc.)
├── stores/
│   └── gameStore.ts     # Estado global con Pinia
├── types/
│   └── question.ts      # Interfaces TypeScript
├── App.vue              # Componente raíz
├── main.ts              # Punto de entrada
└── style.css            # Tailwind + tema oscuro + fuentes
public/
├── questions.json       # Banco de 18 preguntas
└── sounds/              # 5 efectos de sonido MP3
```

## Capturas de pantalla

<!-- TODO: Agregar capturas de las 3 pantallas: inicio, juego y resultado -->

| Inicio | Juego | Resultado |
|--------|-------|-----------|
| ![](screenshots/start.png) | ![](screenshots/game.png) | ![](screenshots/result.png) |

## Autor

Estudiante — IF7102 Multimedios, UCR  
Sede Regional de Guanacaste, Recinto de Liberia | I Ciclo 2026
