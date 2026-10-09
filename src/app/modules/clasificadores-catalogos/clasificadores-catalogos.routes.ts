import { Routes } from '@angular/router';

/** Clasificadores y catálogos: por ahora solo el Catálogo de tipos de instrumentos financieros. */
export const CLASIFICADORES_CATALOGOS_ROUTES: Routes = [
  {
    path: 'procesos/catalogo-tipos-instrumentos-financieros',
    loadComponent: () =>
      import('./tipos-instrumentos-financieros/pages/documents/tipos-instrumentos-documents.component').then(
        (m) => m.TiposInstrumentosDocumentsComponent,
      ),
  },
  {
    path: 'procesos/catalogo-tipos-instrumentos-financieros/solicitud',
    data: { bloqueaNavegacionLateral: true },
    loadComponent: () =>
      import('./tipos-instrumentos-financieros/pages/solicitud/tipos-instrumentos-solicitud.component').then(
        (m) => m.TiposInstrumentosSolicitudComponent,
      ),
  },
];
