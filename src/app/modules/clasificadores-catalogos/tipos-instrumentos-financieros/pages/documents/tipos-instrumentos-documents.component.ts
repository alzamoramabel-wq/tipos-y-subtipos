import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocumentsRecordsPageComponent } from '../../../../../shared/components/documents-records-page/documents-records-page.component';
import { TIPOS_INSTRUMENTOS_DOCUMENTS_CONFIG } from '../../config/tipos-instrumentos-documents.config';

/**
 * «Documentos y registros» del Catálogo de tipos de instrumentos financieros. La pantalla entera la arma
 * `siaf-documents-records-page`; esta página solo le pasa la configuración (filas estáticas por ahora).
 */
@Component({
  selector: 'siaf-tipos-instrumentos-documents',
  standalone: true,
  imports: [DocumentsRecordsPageComponent],
  template: `<siaf-documents-records-page [config]="config" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiposInstrumentosDocumentsComponent {
  readonly config = TIPOS_INSTRUMENTOS_DOCUMENTS_CONFIG;
}
