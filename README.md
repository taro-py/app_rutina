# LifeSync Agent

Aplicación móvil multiplataforma (iOS/Android/Web) construida con **React Native + Expo (TypeScript)**.

## Estado del proyecto (importante)
Este workspace no tiene Node/NPM disponibles ahora mismo, así que el código y estructura están listos, pero para ejecutar la app necesitas instalar **Node.js LTS** en tu PC y luego instalar dependencias.

## Arranque rápido

1. Instala Node.js LTS.
2. En esta carpeta:

```bash
npm install
npx expo start
```

## Estructura

- `app/`: rutas/pantallas (Expo Router)
  - `app/day-setup.tsx`: **Configuración del Día (Onboarding/Contexto)**
  - `app/schedule.tsx`: **Visualización del Horario (Timeline)**
- `src/agent/scheduler.ts`: **Motor Agente** (generación + reglas + validaciones)
- `src/store/dayStore.ts`: estado global (Zustand) + persistencia (AsyncStorage)
- `src/components/`: UI modular (Timeline, BlockCard, Modal de edición, etc.)

## Dónde está la lógica del “Agente”
La lógica vive en `src/agent/scheduler.ts`. Ahí se:
- validan límites (p.ej. intentar meter 26h en un día)
- insertan bloques automáticos (comida/descanso) si faltan
- se sugiere dividir “estudio intenso” en bloques (Pomodoro/90min)
- se emiten **avisos** (p.ej. sueño < 6h)

