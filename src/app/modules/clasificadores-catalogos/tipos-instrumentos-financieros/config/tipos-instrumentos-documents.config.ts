import { ESTADO } from '../../../../core/models/documento.model';
import type {
  DocumentsRecordsColumn,
  DocumentsRecordsConfig,
  DocumentsRecordsFilterOption,
  DocumentsRecordsMenuOption,
  DocumentsRecordsRow,
} from '../../../../shared/types/documents-records.types';
import { TIPOS_INSTRUMENTOS, subtiposDeTipo } from '../data/instrumentos-mif.data';

/**
 * Configuración de «Documentos y registros» del Catálogo de tipos de instrumentos financieros. La pantalla completa
 * la pinta `siaf-documents-records-page`: aquí solo se dice qué columnas, filtros y filas tiene. Los datos son
 * estáticos (aún no hay backend simulado para este catálogo).
 */
export const PROCESS_ROUTE = '/procesos/catalogo-tipos-instrumentos-financieros';
export const REQUEST_ROUTE = `${PROCESS_ROUTE}/solicitud`;
export const NOMBRE_CATALOGO = 'Catálogo de tipos de instrumentos financieros';
const NOMBRE_DOCUMENTO = 'Solicitud de tipos de instrumentos financieros';
const SISTEMA = 'Sistema Nacional de Tesorería';

const documentColumns: DocumentsRecordsColumn[] = [
  { key: 'document', label: 'Documento', visibility: 'visible', group: 'default', widthClass: 'w-[280px]' },
  { key: 'number', label: 'Número', visibility: 'visible', group: 'default', widthClass: 'w-[90px]' },
  { key: 'actionType', label: 'Tipo de acción', visibility: 'visible', group: 'default', widthClass: 'w-[140px]' },
  { key: 'status', label: 'Estado', visibility: 'visible', group: 'default', widthClass: 'w-[120px]', kind: 'flow-status' },
  { key: 'system', label: 'Sistema', visibility: 'visible', group: 'default', widthClass: 'w-[150px]' },
  { key: 'date', label: 'Fecha de registro', visibility: 'visible', group: 'default', widthClass: 'w-[120px]' },
  { key: 'entityId', label: 'ID Entidad', visibility: 'visible', group: 'default', widthClass: 'w-[130px]' },
  { key: 'entity', label: 'Entidad', visibility: 'visible', group: 'default', widthClass: 'w-[280px]' },
];

const recordColumns: DocumentsRecordsColumn[] = [
  { key: 'status', label: 'Estado', visibility: 'visible', group: 'default', widthClass: 'w-[110px]', kind: 'record-status' },
  { key: 'codigo', label: 'Código TIF', visibility: 'visible', group: 'default', widthClass: 'w-[110px]' },
  { key: 'tipo', label: 'Tipo', visibility: 'visible', group: 'default', widthClass: 'w-[240px]' },
  { key: 'abreviatura', label: 'Abreviatura', visibility: 'visible', group: 'default', widthClass: 'w-[170px]' },
  { key: 'descripcion', label: 'Descripción', visibility: 'visible', group: 'default', widthClass: 'min-w-[320px]' },
  { key: 'esInstrumento', label: '¿Es instrumento financiero?', visibility: 'visible', group: 'default', widthClass: 'w-[200px]' },
  { key: 'subtipos', label: 'Subtipos', visibility: 'visible', group: 'default', widthClass: 'w-[100px]', align: 'right' },
];

/** Registros: los tipos del MIF (`mif-instrumentos.xlsx`), con la cantidad de subtipos de cada uno. */
const recordRows: DocumentsRecordsRow[] = TIPOS_INSTRUMENTOS.map((t) => ({
  status: 'Activo',
  codigo: t.codigo,
  tipo: t.nombre,
  abreviatura: t.abreviatura,
  descripcion: t.descripcion,
  esInstrumento: t.esInstrumento ? 'Sí' : 'No',
  subtipos: String(subtiposDeTipo(t.codigo).length),
}));

const fieldsMenuOptions: DocumentsRecordsMenuOption[] = [
  { label: 'Documento' },
  { label: 'Tipo de acción' },
  { label: 'Estado' },
];

const filterCampoOptions: DocumentsRecordsFilterOption[] = [
  { label: 'Documento', value: 'document' },
  { label: 'Número', value: 'number' },
  { label: 'Tipo de acción', value: 'actionType' },
  { label: 'Estado', value: 'status' },
];

const filterValorOptions: DocumentsRecordsFilterOption[] = [
  { label: ESTADO.ELABORADO, value: ESTADO.ELABORADO },
  { label: ESTADO.APROBADO, value: ESTADO.APROBADO },
  { label: ESTADO.ELIMINADO, value: ESTADO.ELIMINADO },
  { label: 'Creación', value: 'Creación' },
  { label: 'Modificación', value: 'Modificación' },
];

const fila = (number: string, status: string, date: string): DocumentsRecordsRow => ({
  document: NOMBRE_DOCUMENTO,
  number,
  actionType: 'Creación',
  status,
  system: SISTEMA,
  date,
  entityId: '1. Institucional',
  entity: '009 - Ministerio de Economía y Finanzas',
});

export const TIPOS_INSTRUMENTOS_DOCUMENTS_CONFIG: DocumentsRecordsConfig = {
  title: NOMBRE_CATALOGO,
  processId: 'catalogo-tipos-instrumentos-financieros',
  defaultRequestRoute: REQUEST_ROUTE,
  createDocumentOptions: [
    {
      id: 'catalogo-tipos-instrumentos-financieros',
      label: NOMBRE_CATALOGO,
      route: REQUEST_ROUTE,
      documents: [NOMBRE_DOCUMENTO],
      documentOptions: [{ label: NOMBRE_DOCUMENTO, route: REQUEST_ROUTE, actionTypes: ['Creación', 'Modificación'] }],
      actionTypes: ['Creación', 'Modificación'],
    },
  ],
  breadcrumbs: [
    { label: 'Inicio', href: '/panel' },
    { label: 'Catálogos', href: '/panel' },
    { label: NOMBRE_CATALOGO, href: PROCESS_ROUTE },
    { label: 'Documentos y registros' },
  ],
  documentRows: [
    fila('0006', ESTADO.ELABORADO, '16/10/2025'),
    fila('0005', ESTADO.ELABORADO, '29/09/2025'),
    fila('0004', ESTADO.ELABORADO, '24/09/2025'),
    fila('0003', ESTADO.APROBADO, '31/08/2025'),
    fila('0002', ESTADO.APROBADO, '15/12/2023'),
    fila('0001', ESTADO.ELIMINADO, '20/11/2023'),
  ],
  recordRows,
  documentColumns,
  recordColumns,
  documentTableMinWidthClass: 'min-w-[1310px]',
  recordTableMinWidthClass: 'min-w-[1200px]',
  recordTrackKey: 'codigo',
  recordHistoryDocumentLabel: NOMBRE_DOCUMENTO,
  statusFilterOptions: [ESTADO.ELABORADO, ESTADO.APROBADO, ESTADO.ELIMINADO],
  actionTypeFilterOptions: ['Creación', 'Modificación'],
  filterCampoOptions,
  filterValorOptions,
  fieldsMenuOptions,
  recordFilter1Label: '¿Es instrumento financiero?',
  recordFilter1Key: 'esInstrumento',
  recordFilter1Options: ['Sí', 'No'],
  recordFilterCampoOptions: [
    { label: 'Tipo', value: 'tipo' },
    { label: 'Abreviatura', value: 'abreviatura' },
    { label: '¿Es instrumento financiero?', value: 'esInstrumento' },
  ],
  recordFilterValorOptions: [
    { label: 'Sí', value: 'Sí' },
    { label: 'No', value: 'No' },
  ],
  accionPrincipal: 'verificar',
  ocultarSubtitulo: true,
};
