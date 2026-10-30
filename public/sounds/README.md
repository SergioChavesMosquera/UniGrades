# public/sounds

## approve.mp3 (ACCIÓN REQUERIDA DEL USUARIO)

La microinteracción de celebración (`lib/celebrate.ts`) reproduce un sonido corto
al aprobar una materia. El código lo referencia como un asset LOCAL:

```
/sounds/approve.mp3
```

Este repositorio **no incluye** el binario `approve.mp3` (no se puede generar un mp3
válido como texto, y un archivo corrupto rompería la reproducción). Debes colocar aquí
un archivo real:

1. Consigue (o graba/exporta) un efecto de sonido corto y agradable, con licencia que
   permita su uso (p. ej. un "chime"/"success" de ~0.5–1.5 s).
2. Guárdalo como `public/sounds/approve.mp3` (exactamente ese nombre y ruta).

Mientras el archivo no exista, la app funciona con normalidad: el confeti se dispara y
el intento de reproducir el sonido falla en silencio (está contemplado en
`lib/celebrate.ts`, que nunca lanza ni bloquea la UI). No se hace ninguna llamada de red
externa para el sonido ni para el confeti.
