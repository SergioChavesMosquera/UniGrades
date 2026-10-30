---
inclusion: manual
---

# UniGrades — Lineamientos de Identidad Visual y Frontend

> Lineamientos definidos por el equipo (Santiago, líder) para el rediseño del frontend.
> El MVP se construyó con UI mínima blanco/negro DELIBERADAMENTE, para que este rediseño
> sea SOLO frontend, sin tocar backend, lógica ni reglas de negocio.
> Este archivo es la fuente de verdad del diseño. Actívalo en la sesión de frontend.

## Marca / Logo
- **Símbolo:** una "U" minimalista cuyo trazo derecho se alarga hacia arriba y termina en
  un check (aprobado). Se lee como "universidad" y "meta cumplida" a la vez.
- **Wordmark:** "unigrades" en minúsculas, geométrico y redondeado; la "g" dibujada como un
  pequeño aro de progreso.
- **Versiones:** símbolo solo (icono de app / avatar de redes), horizontal (símbolo +
  wordmark), y monocromo (blanco y negro).
- **Zona de respeto:** el alto de la U alrededor del logo. **Tamaño mínimo digital:** 24 px
  de alto.
- **Aviso en el pie de la web (recomendado):** "UNIGRADES es un proyecto independiente de
  estudiantes y no está afiliado oficialmente a la Universidad Nacional de Colombia."
  (Evita confusión con la marca institucional; NO usar el escudo ni los símbolos de la UNAL.)

## Paleta de color
| Rol | Nombre | HEX | Uso |
|-----|--------|-----|-----|
| Principal | Verde esmeralda | `#0B6B4F` | Botones, encabezados, logo |
| Acento / éxito | Menta | `#2ED8A3` | Aprobado, progreso, resaltados |
| Fondo oscuro | Azul noche | `#0F1B2D` | Modo oscuro, fondos de video |
| Fondo claro | Blanco hueso | `#F7F8F5` | Fondo de la web |
| Alerta | Ámbar | `#FFB020` | "En riesgo", textos resaltados |
| Peligro | Coral | `#FF5C5C` | "Reprobando", errores |
| Texto secundario | Gris pizarra | `#5B6770` | Etiquetas, ayudas |

Modo claro y oscuro usando **las mismas variables de color**.

## Tipografía (Google Fonts)
| Uso | Fuente | Detalle |
|-----|--------|---------|
| Títulos y logo | Sora (700) | Geométrica, moderna, amigable |
| Texto corrido | Inter (400 y 500) | Muy legible en pantalla |
| Números y notas | JetBrains Mono (600) | Cifras tabulares: las notas se alinean y se leen al instante |

## Estilo de interfaz
- **Tarjetas** de esquinas redondeadas (**16 px**) con sombra suave, una por materia.
- **Anillo de progreso por materia:** cuánto % ya se evaluó.
- **Etiqueta de estado con color:** "Vas bien" (menta), "En riesgo" (ámbar), "Necesitas
  remontar" (coral).
- **Tarjeta estrella:** "Necesitas un 3,3 en el próximo parcial", en tamaño grande, siempre
  visible. (Requiere un cálculo de "nota necesaria" — ver nota de alcance abajo.)
- **Iconos** de línea redondeada, 2 px (familia **Lucide**).
- **Microinteracciones:** el número se anima al cambiar; sonido y confeti discretos al
  lograr "aprobado".
- **Primero móvil (mobile-first):** la web debe verse perfecta en celular, que es donde los
  estudiantes la usarán.

## Notas de alcance (para la sesión de spec de frontend)
- Lo anterior es SOLO frontend salvo una excepción a evaluar: la "tarjeta estrella"
  (¿qué nota necesitas en el próximo parcial?) implica un cálculo nuevo. Decidir en la spec
  si se resuelve en el cliente (con datos que ya existen) o si requiere una vista/función
  nueva en la base de datos.
- El logo lo produce el equipo aparte (Sergio); el frontend debe soportar sus 3 versiones.
- Respetar la separación backend/frontend: no cambiar servicios, reglas (RN-1..RN-7) ni el
  esquema. Reemplazar los componentes de UI (components/ui) y los estilos, manteniendo la
  capa de datos intacta.
