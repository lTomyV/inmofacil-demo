# InmoFacil Demo - Arquitectura de Código

## 📁 Estructura del Proyecto

```
inmofacil-demo/
├── src/
│   ├── components/           # Componentes React organizados por dominio
│   │   ├── dashboard/       # Componentes del dashboard administrativo
│   │   │   ├── CollectionPulse.tsx
│   │   │   ├── DelinquentTable.tsx
│   │   │   ├── ContractTimeline.tsx
│   │   │   ├── TicketList.tsx
│   │   │   └── index.ts
│   │   ├── properties/      # Componentes de propiedades
│   │   │   ├── PropertyCard.tsx
│   │   │   └── index.ts
│   │   ├── shared/          # Componentes compartidos/reutilizables
│   │   │   ├── StatCard.tsx
│   │   │   └── index.ts
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── index.ts
│   │   └── index.ts         # Exportación centralizada
│   ├── hooks/               # Custom React Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDarkMode.ts
│   │   └── index.ts
│   ├── utils/               # Funciones utilitarias
│   │   ├── whatsapp.ts
│   │   ├── formatters.ts
│   │   └── index.ts
│   ├── types/               # Definiciones de TypeScript
│   │   └── index.ts
│   ├── constants/           # Constantes y datos iniciales
│   │   ├── themes.ts
│   │   ├── initialData.ts
│   │   └── index.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.ts             # Exportación centralizada de src
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🏗️ Principios de Arquitectura

### 1. **Separación de Responsabilidades**
- **Components**: Solo UI y lógica de presentación
- **Hooks**: Lógica reutilizable y efectos secundarios
- **Utils**: Funciones puras sin side-effects
- **Constants**: Datos estáticos y configuración
- **Types**: Definiciones de tipos TypeScript

### 2. **Organización por Dominio**
Los componentes están organizados por su dominio de negocio:
- `dashboard/`: Métricas y visualizaciones del admin
- `properties/`: Todo relacionado con propiedades
- `shared/`: Componentes reutilizables en toda la app
- `layout/`: Estructura y navegación

### 3. **Código Limpio**
- Nombres descriptivos y autoexplicativos
- Funciones pequeñas y con una sola responsabilidad
- Comentarios JSDoc en todos los archivos
- Exportaciones centralizadas con `index.ts`

### 4. **Type Safety**
- TypeScript estricto habilitado
- Interfaces explícitas para todas las props
- Tipos exportados desde un único punto
- Path aliases configurados para imports limpios

## 🔧 Path Aliases Configurados

```typescript
@/*          → src/*
@components/* → src/components/*
@hooks/*      → src/hooks/*
@utils/*      → src/utils/*
@types/*      → src/types/*
@constants/*  → src/constants/*
```

## 📦 Componentes Principales

### Dashboard
- **CollectionPulse**: Visualiza el progreso de cobranza mensual
- **DelinquentTable**: Tabla de morosos con acciones de WhatsApp
- **ContractTimeline**: Semáforo de vencimientos de contratos
- **TicketList**: Gestión de tickets de reparación

### Shared
- **StatCard**: Tarjeta de estadística reutilizable

### Properties
- **PropertyCard**: Tarjeta de propiedad con información detallada

### Layout
- **AdminSidebar**: Barra lateral de navegación administrativa

## 🪝 Custom Hooks

### useLocalStorage
```typescript
const [value, setValue] = useLocalStorage<T>('key', defaultValue);
```
Gestiona estado persistente en localStorage con type safety.

### useDarkMode
```typescript
const isDark = useDarkMode(appearanceMode);
```
Maneja modo oscuro con detección de preferencias del sistema.

## 🛠️ Utilidades

### WhatsApp
- `openWhatsApp(phone, message)`: Abre WhatsApp con mensaje
- `getTenantReminderMessage()`: Genera mensaje para inquilino
- `getGuarantorAlertMessage()`: Genera mensaje para garante
- `getPropertyInquiryMessage()`: Genera mensaje de consulta

### Formatters
- `formatCurrency(amount)`: Formatea moneda argentina
- `formatDate(dateString)`: Formatea fecha a locale español
- `getInitials(name)`: Obtiene iniciales de un nombre
- `truncateText(text, length)`: Trunca texto con ellipsis

## 🎨 Patrones de Diseño

### Component Pattern
```typescript
export interface ComponentProps {
  // Props with explicit types
}

export const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return (/* JSX */);
};
```

### Export Pattern
Cada carpeta tiene un `index.ts` que exporta todos sus módulos:
```typescript
export * from './Module1';
export * from './Module2';
```

## 🚀 Mejoras Implementadas

1. ✅ **Hooks personalizados** para lógica reutilizable
2. ✅ **Utilidades centralizadas** sin duplicación
3. ✅ **Organización por dominio** más escalable
4. ✅ **Type safety completo** con TypeScript
5. ✅ **Exportaciones centralizadas** con barrel files
6. ✅ **Path aliases** para imports limpios
7. ✅ **Comentarios JSDoc** para documentación
8. ✅ **Separación clara** de responsabilidades

## 📝 Estándares de Calidad

- **ESLint**: Configurado con reglas estrictas
- **TypeScript**: Modo strict habilitado
- **Imports**: Organizados y sin duplicados
- **Naming**: Convenciones consistentes (PascalCase para componentes, camelCase para funciones)
- **Comments**: JSDoc en archivos principales
- **Structure**: Máximo 3 niveles de anidación en carpetas

## 🔄 Flujo de Datos

```
App.tsx (State Management)
    ↓
Components (Presentation)
    ↓
Hooks (Business Logic)
    ↓
Utils (Pure Functions)
```

## 📚 Próximos Pasos

- [ ] Implementar Context API para state global
- [ ] Agregar tests unitarios con Vitest
- [ ] Implementar error boundaries
- [ ] Agregar loading states
- [ ] Implementar React Query para data fetching
- [ ] Agregar Storybook para documentación de componentes
