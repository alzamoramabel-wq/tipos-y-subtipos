import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BreadcrumbItem } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { SolicitudeFormCardComponent } from '../../../../../shared/components/solicitude-form-card/solicitude-form-card.component';
import { SolicitudeInfoCardComponent, SolicitudeInfoField } from '../../../../../shared/components/solicitude-info-card/solicitude-info-card.component';
import { SolicitudePageLayoutComponent } from '../../../../../shared/components/solicitude-page-layout/solicitude-page-layout.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { DateTimePickerComponent } from '../../../../../shared/ui/date-time-picker/date-time-picker.component';
import { CurrentUserService } from '../../../../../core/auth/current-user.service';
import { ActionTrackerComponent, ActionTrackerSummary } from '../../../../../shared/ui/action-tracker/action-tracker.component';
import { DocumentSummaryCardComponent } from '../../../../../shared/ui/document-summary-card/document-summary-card.component';
import { ModalComponent } from '../../../../../shared/ui/modal/modal.component';
import { MessageBoxComponent } from '../../../../../shared/ui/message-box/message-box.component';
import { ReadonlyFieldComponent } from '../../../../../shared/ui/readonly-field/readonly-field.component';
import { RadioComponent } from '../../../../../shared/ui/radio/radio.component';
import { SnackbarComponent } from '../../../../../shared/ui/snackbar/snackbar.component';
import { SidePanelComponent } from '../../../../../shared/ui/side-panel/side-panel.component';
import { TextAreaControlComponent } from '../../../../../shared/ui/text-area-control/text-area-control.component';
import { TextFieldComponent } from '../../../../../shared/ui/text-field/text-field.component';
import { GrillaCatalogoComponent, GrillaColumna, GrillaFila } from './grilla-catalogo.component';
import { NOMBRE_CATALOGO, PROCESS_ROUTE } from '../../config/tipos-instrumentos-documents.config';

type FormularioTipo = {
  codigo: string;
  tipo: string;
  abreviatura: string;
  descripcion: string;
  esInstrumento: string;
  vigente: string;
  fechaDesde: string;
  fechaHasta: string;
};

type FormularioSubtipo = {
  id: string;
  codigoSif: string;
  subtipo: string;
  abreviatura: string;
  descripcion: string;
  registroOperaciones: string;
  permitirEjecutora: string;
  pregunta: string;
  fechaInicioVigencia: string;
  condicionesComplementarias: string;
};

const SUBTIPO_VACIO: FormularioSubtipo = {
  id: '',
  codigoSif: '',
  subtipo: '',
  abreviatura: '',
  descripcion: '',
  registroOperaciones: '',
  permitirEjecutora: '',
  pregunta: '',
  fechaInicioVigencia: '',
  condicionesComplementarias: '',
};

/** Tipo ya aceptado, con los subtipos que se le agregaron. */
type TipoAgregado = { id: string; tipo: FormularioTipo; subtipos: FormularioSubtipo[] };

const FORMULARIO_VACIO: FormularioTipo = {
  codigo: '',
  tipo: '',
  abreviatura: '',
  descripcion: '',
  esInstrumento: '',
  vigente: '',
  fechaDesde: '',
  fechaHasta: '',
};

/**
 * Solicitud de tipos de instrumentos financieros (pantalla inicial de «Crear documento»). La cabecera con sus
 * botones la pinta `siaf-solicitude-page-layout`; aquí solo se arma el contenido: los datos generales y la sección
 * de tipos de instrumentos. El botón (+) abre el formulario de un tipo (código, tipo, abreviatura, descripción,
 * vigencia) y, mientras está abierto, la botonera de la cabecera queda deshabilitada. Los datos no se guardan todavía.
 */
@Component({
  selector: 'siaf-tipos-instrumentos-solicitud',
  standalone: true,
  imports: [
    ActionTrackerComponent,
    DocumentSummaryCardComponent,
    ButtonComponent,
    DateTimePickerComponent,
    MessageBoxComponent,
    ModalComponent,
    RadioComponent,
    ReadonlyFieldComponent,
    SolicitudeFormCardComponent,
    SolicitudeInfoCardComponent,
    SidePanelComponent,
    SolicitudePageLayoutComponent,
    GrillaCatalogoComponent,
    SnackbarComponent,
    TextAreaControlComponent,
    TextFieldComponent,
  ],
  template: `
    <div class="min-h-[calc(100vh-56px)] bg-[var(--sys-color-bg-surfaces-surface-lowest)] text-text">
      <siaf-solicitude-page-layout
        [breadcrumbs]="breadcrumbs"
        role="creator"
        [state]="elaborado() ? 'elaborated' : 'new'"
        [heading]="heading"
        [secondaryText]="tipoAccion"
        [showReturn]="!!elaborado()"
        [saveDisabled]="!tipos().length"
        [verifyDisabled]="!elaborado()"
        [customActions]="formularioAbierto()"
        [showButtonGroup]="!detalle()"
        (canceled)="cancelar()"
        (returned)="cancelar()"
        (saved)="modalGrabar.set(true)"
      >
        <!-- Con el formulario abierto, la botonera de la cabecera queda apagada (Figma). -->
        <ng-container actions>
          <siaf-button variant="secondary" size="md" icon="close" [disabled]="true">Cancelar</siaf-button>
          <siaf-button variant="secondary" size="md" icon="save" [disabled]="true">Grabar</siaf-button>
          <siaf-button variant="secondary" size="md" icon="check_circle" [disabled]="true">Verificar</siaf-button>
        </ng-container>

        @if (detalle(); as d) {
          <!-- Detalle de un tipo ya agregado, en modo visualización (Figma «Información detallada»). -->
          <section class="flex items-center gap-siaf-md rounded-siaf-md bg-surface px-siaf-lg py-siaf-md">
            <siaf-button variant="secondary" size="md" icon="chevron_left" [iconOnly]="true" ariaLabel="Volver a la lista de tipos" (click)="cerrarDetalle()" />
            <h2 class="m-0 text-base font-bold uppercase tracking-[0.02px] text-text">Información detallada</h2>
          </section>

          <siaf-solicitude-form-card title="Tipos de instrumentos financieros">
            <div class="grid gap-x-siaf-lg gap-y-siaf-md md:grid-cols-[310px_465px_1fr]">
              <readonly-field caption="Código TIF" [value]="d.tipo.codigo" />
              <readonly-field caption="Tipo" [value]="d.tipo.tipo" />
              <readonly-field caption="Abreviatura" [value]="d.tipo.abreviatura" />
            </div>
            <readonly-field caption="Descripción" [value]="d.tipo.descripcion" />
            <readonly-field caption="¿Es instrumento financiero?" [value]="d.tipo.esInstrumento === 'SI' ? 'Sí' : 'No'" />

            <section class="flex flex-col gap-siaf-xs">
              <h3 class="m-0 flex min-h-10 items-center text-sm font-bold uppercase text-text">Vigencia</h3>
              <div class="grid gap-x-siaf-lg gap-y-siaf-md md:grid-cols-[310px_465px_1fr]">
                <readonly-field caption="Estado" [value]="d.tipo.vigente === 'SI' ? 'Si' : d.tipo.vigente === 'NO' ? 'No' : '-'" />
                <readonly-field caption="Fecha desde" [value]="formatearFecha(d.tipo.fechaDesde, '--/--/----')" />
                <readonly-field caption="Fecha hasta" [value]="formatearFecha(d.tipo.fechaHasta, '--/--/----')" />
              </div>
            </section>

            <section class="flex flex-col gap-siaf-xs">
              <h3 class="m-0 flex min-h-10 items-center text-sm font-bold uppercase text-text">Subtipos de instrumentos financieros</h3>
              <siaf-grilla-catalogo [columns]="columnasSubtipos" [rows]="aFilasSubtipos(d.subtipos)" [showSearch]="false" [showSelection]="false" />
            </section>
          </siaf-solicitude-form-card>
        } @else {
        @if (elaborado(); as e) {
          <section class="grid gap-siaf-md lg:grid-cols-[1fr_360px]">
            <siaf-solicitude-info-card [fields]="datosElaborado()" />
            <siaf-document-summary-card [documentNumber]="e.numero" status="Elaborado" />
          </section>
        } @else {
          <siaf-solicitude-info-card [fields]="datosGenerales" />
        }

        <siaf-solicitude-form-card title="Tipos de instrumentos financieros">
          @if (formularioAbierto()) {
            <div card-actions class="flex items-center gap-siaf-xs">
              <siaf-button variant="secondary" size="md" (click)="cancelarFormulario()">Cancelar</siaf-button>
              <siaf-button variant="accent" size="md" [disabled]="!puedeAceptarTipo()" (click)="aceptarTipo()">Aceptar</siaf-button>
            </div>
          } @else if (!elaborado()) {
            <siaf-button card-actions variant="accent" size="md" icon="add" [iconOnly]="true" ariaLabel="Agregar tipo de instrumento financiero" (click)="abrirFormulario()" />
          }

          @if (formularioAbierto()) {
            <div class="grid gap-x-siaf-lg gap-y-siaf-lg md:grid-cols-[286px_1fr_1fr]">
              <siaf-input
                label="Código TIF"
                [required]="true"
                [value]="form().codigo"
                (valueChange)="actualizar('codigo', $any($event))"
              />
              <siaf-input
                label="Tipo"
                [required]="true"
                [value]="form().tipo"
                (valueChange)="actualizar('tipo', $any($event))"
              />
              <siaf-input
                label="Abreviatura"
                [required]="true"
                [value]="form().abreviatura"
                (valueChange)="actualizar('abreviatura', $any($event))"
              />
            </div>

            <text-area-control
              placeholder="Descripción"
              [required]="true"
              [maxlength]="200"
              [value]="form().descripcion"
              (valueChange)="actualizar('descripcion', $event)"
            />

            <siaf-radio-group
              label="¿Es instrumento financiero?"
              name="es-instrumento"
              [inline]="true"
              [required]="true"
              [options]="opcionesSiNo"
              [value]="form().esInstrumento"
              (valueChange)="actualizar('esInstrumento', $any($event))"
            />

            <section class="flex flex-col gap-siaf-xs">
              <h3 class="m-0 flex min-h-10 items-center text-sm font-bold uppercase text-text">Vigencia</h3>
              <div class="grid items-center gap-x-siaf-lg gap-y-siaf-md md:grid-cols-3">
                <siaf-radio-group
                  name="vigencia"
                  [inline]="true"
                  [options]="opcionesVigencia"
                  [value]="form().vigente"
                  (valueChange)="actualizar('vigente', $any($event))"
                />
                <siaf-date-time-picker
                  label="Fecha desde"
                  [required]="vigente()"
                  [disabled]="sinVigencia()"
                  [fullWidth]="true"
                  [defaultToToday]="false"
                  [value]="form().fechaDesde"
                  (valueChange)="actualizar('fechaDesde', $event)"
                />
                <siaf-date-time-picker
                  label="Fecha hasta"
                  [required]="vigente()"
                  [disabled]="sinVigencia()"
                  [fullWidth]="true"
                  [defaultToToday]="false"
                  [minDate]="form().fechaDesde"
                  [value]="form().fechaHasta"
                  (valueChange)="actualizar('fechaHasta', $event)"
                />
              </div>
            </section>

            <section class="flex flex-col gap-siaf-xs">
              <div class="flex min-h-10 items-center justify-between gap-siaf-md">
                <h3 class="m-0 text-sm font-bold uppercase text-text">Subtipos de instrumentos financieros</h3>
                <siaf-button variant="accent" size="md" icon="add" [iconOnly]="true" [disabled]="!formularioValido()" ariaLabel="Agregar subtipo de instrumento financiero" (click)="abrirSubtipo()" />
              </div>
              @if (filasSubtipos().length) {
                <siaf-grilla-catalogo #grillaSubtipos [columns]="columnasSubtipos" [rows]="filasSubtipos()" [editable]="true" (editar)="editarSubtipo($event)" (borrar)="pedirBorrado('subtipo', $event)" />
              } @else {
                <message-box text="Por favor, haga clic en el botón (+) para agregar una opción." />
              }
            </section>
          } @else if (tipos().length) {
            <siaf-grilla-catalogo #grillaTipos [columns]="columnasTipos" [rows]="filasTipos()" [clickable]="true" [editable]="!elaborado()" [showSelection]="!elaborado()" [showTopPagination]="!!elaborado()" (rowClick)="abrirDetalle($event)" (editar)="editarTipo($event)" (borrar)="pedirBorrado('tipo', $event)" />
          } @else {
            <message-box text="Por favor, haga clic en el botón (+) para agregar una opción." />
          }
        </siaf-solicitude-form-card>

        @if (elaborado()) {
          <siaf-action-tracker [showSummaryCards]="true" [showTabs]="false" [summaryItems]="trazabilidad()" />
        }
        }
      </siaf-solicitude-page-layout>

      <!-- Panel de subtipos: entra desde la derecha, sin fondo oscuro (Figma «Side Panel»). -->
      <siaf-side-panel
        [open]="subtipoAbierto()"
        [backdrop]="false"
        [title]="editandoSubtipoId() ? 'Editar subtipos de instrumentos financieros' : 'Agregar subtipos de instrumentos financieros'"
        [confirmDisabled]="!puedeAceptarSubtipo()"
        (closed)="cerrarSubtipo()"
        (confirmed)="aceptarSubtipo()"
      >
        <div class="flex flex-col gap-siaf-lg px-siaf-sm py-siaf-xs">
          <div class="flex flex-wrap gap-x-siaf-lg gap-y-siaf-md">
            <siaf-input class="w-[286px] max-w-full" label="Código TIF" [required]="true" [disabled]="true" [value]="form().codigo" />
            <siaf-input class="w-[286px] max-w-full" label="Tipo" [required]="true" [disabled]="true" [value]="form().tipo" />
          </div>

          <div class="grid gap-x-siaf-lg gap-y-siaf-lg md:grid-cols-[286px_1fr_1fr]">
            <siaf-input label="Código SIF" focusHint="Ingrese un código numérico de 2 dígitos" [required]="true" [value]="subtipo().codigoSif" (valueChange)="actualizarSubtipo('codigoSif', $any($event))" />
            <siaf-input label="Subtipo" focusHint="Ingrese el nombre del subtipo" [required]="true" [value]="subtipo().subtipo" (valueChange)="actualizarSubtipo('subtipo', $any($event))" />
            <siaf-input label="Abreviatura" focusHint="Ingrese un nombre abreviado del subtipo" [required]="true" [value]="subtipo().abreviatura" (valueChange)="actualizarSubtipo('abreviatura', $any($event))" />
          </div>

          <text-area-control
            placeholder="Descripción"
            focusHint="Ingrese la definición del subtipo"
            [required]="true"
            [maxlength]="200"
            [value]="subtipo().descripcion"
            (valueChange)="actualizarSubtipo('descripcion', $event)"
          />

          <div class="flex flex-wrap gap-x-siaf-lg gap-y-siaf-md">
            <siaf-radio-group
              class="w-[286px] max-w-full"
              label="Registro de operaciones"
              name="registro-operaciones"
              [inline]="true"
              [options]="opcionesRegistroOperaciones"
              [value]="subtipo().registroOperaciones"
              (valueChange)="actualizarSubtipo('registroOperaciones', $any($event))"
            />
            <siaf-radio-group
              class="w-[286px] max-w-full"
              label="Permitir registrar a la ejecutora"
              name="permitir-ejecutora"
              [inline]="true"
              [options]="opcionesSiNoSubtipo"
              [value]="subtipo().permitirEjecutora"
              (valueChange)="actualizarSubtipo('permitirEjecutora', $any($event))"
            />
          </div>

          <text-area-control
            placeholder="Pregunta para determinar si es activo"
            focusHint="Ingrese una pregunta. Cuando el usuario registre un instrumento financiero, una respuesta «Sí» lo clasificará como ACTIVO y una respuesta «No», como PASIVO."
            [required]="true"
            [maxlength]="200"
            [value]="subtipo().pregunta"
            (valueChange)="actualizarSubtipo('pregunta', $event)"
          />

          <siaf-radio-group
            label="Campo para fecha inicio de vigencia"
            name="fecha-inicio-vigencia"
            [inline]="true"
            [options]="opcionesFechaInicio"
            [value]="subtipo().fechaInicioVigencia"
            (valueChange)="actualizarSubtipo('fechaInicioVigencia', $any($event))"
          />

          <siaf-radio-group
            label="Campo para registro de condiciones financieras complementarias"
            name="condiciones-complementarias"
            [inline]="true"
            [options]="opcionesCondiciones"
            [value]="subtipo().condicionesComplementarias"
            (valueChange)="actualizarSubtipo('condicionesComplementarias', $any($event))"
          />
        </div>
      </siaf-side-panel>

      <!-- Aviso al agregar un tipo con sus subtipos (Figma «snackbar»). -->
      <div class="fixed bottom-siaf-lg left-1/2 z-50 w-[min(430px,calc(100vw-32px))] -translate-x-1/2">
        @if (avisoElaborado()) {
          <siaf-snackbar variant="creation-elaborated" requestType="creación" [requestNumber]="elaborado()?.numero ?? ''" [open]="avisoAbierto()" (closed)="avisoAbierto.set(false)" />
        } @else {
          <siaf-snackbar tone="neutral" [message]="avisoMensaje()" [open]="avisoAbierto()" (closed)="avisoAbierto.set(false)" />
        }
      </div>

      <!-- Confirmación de «Grabar» (Figma «¿Grabar documento?»). -->
      <siaf-modal
        [open]="modalGrabar()"
        title="¿Grabar documento?"
        description="Al confirmar, se asignará un número a la solicitud y su estado cambiará a Elaborado."
        [showIllustration]="true"
        illustrationSrc="assets/figma/modals/save_1.svg"
        confirmLabel="Aceptar"
        confirmVariant="primary"
        (canceled)="modalGrabar.set(false)"
        (closed)="modalGrabar.set(false)"
        (confirmed)="grabar()"
      />

      <!-- Confirmación de borrado: modal con fondo (Figma «¿Borrar ítem (s)?»). -->
      <siaf-modal
        [open]="!!borrado()"
        title="¿Borrar ítem (s)?"
        description="Perderá todos los datos ingresados."
        [showIllustration]="true"
        illustrationSrc="assets/figma/modals/delete.svg"
        confirmLabel="Aceptar"
        confirmVariant="primary"
        (canceled)="cancelarBorrado()"
        (closed)="cancelarBorrado()"
        (confirmed)="confirmarBorrado()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiposInstrumentosSolicitudComponent {
  private readonly router = inject(Router);
  private readonly currentUser = inject(CurrentUserService);
  private readonly route = inject(ActivatedRoute);

  readonly heading = 'Solicitud de tipos de instrumentos financieros';
  /** Llega de «Crear documento» como `?actionType=creacion|modificacion`. */
  readonly tipoAccion = this.route.snapshot.queryParamMap.get('actionType') === 'modificacion' ? 'Modificación' : 'Creación';

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/panel' },
    { label: NOMBRE_CATALOGO, href: PROCESS_ROUTE },
    { label: 'Registro' },
  ];

  readonly datosGenerales: SolicitudeInfoField[] = [
    { label: 'Fecha', value: '--/--/----     --:--:--' },
    { label: 'Ente rector', value: 'DIRECCIÓN GENERAL DEL TESORO PÚBLICO' },
  ];

  readonly opcionesSiNo = [
    { label: 'Sí', value: 'SI' },
    { label: 'No', value: 'NO' },
  ];
  readonly opcionesVigencia = [
    { label: 'SI', value: 'SI' },
    { label: 'NO', value: 'NO' },
  ];

  readonly opcionesRegistroOperaciones = [
    { label: 'Requiere', value: 'REQUIERE' },
    { label: 'No requiere', value: 'NO_REQUIERE' },
  ];
  readonly opcionesSiNoSubtipo = [
    { label: 'Si', value: 'SI' },
    { label: 'No', value: 'NO' },
  ];
  readonly opcionesFechaInicio = [
    { label: 'Fecha de Emisión/ Apertura/ Colocación / Contratación', value: 'EMISION' },
    { label: 'Fecha de Negociación/ Adquisición/ Cesión de la operación', value: 'NEGOCIACION' },
    { label: 'No aplica', value: 'NO_APLICA' },
  ];
  readonly opcionesCondiciones = [
    { label: 'Registro por entidad contraparte', value: 'CONTRAPARTE' },
    { label: 'Registro por instrumento financiero', value: 'INSTRUMENTO' },
  ];

  private readonly grillaSubtipos = viewChild('grillaSubtipos', { read: ElementRef<HTMLElement> });
  private readonly grillaSubtiposCmp = viewChild('grillaSubtipos', { read: GrillaCatalogoComponent });

  readonly formularioAbierto = signal(false);
  readonly subtipoAbierto = signal(false);
  readonly avisoAbierto = signal(false);
  readonly modalGrabar = signal(false);
  /** Con datos, la solicitud ya se grabó: número, fecha/hora y quién la elaboró (estado «Elaborado»). */
  readonly elaborado = signal<{ numero: string; fecha: string; usuario: string } | null>(null);
  readonly avisoElaborado = signal(false);
  private static correlativo = 0;

  readonly datosElaborado = computed<SolicitudeInfoField[]>(() => [
    { label: 'Fecha', value: this.elaborado()?.fecha ?? '' },
    { label: 'Ente rector', value: 'DIRECCIÓN GENERAL DEL TESORO PÚBLICO' },
  ]);
  /** Elaborado por quien grabó; verificado y aprobado quedan «No asignado aún» (campos vacíos). */
  readonly trazabilidad = computed<ActionTrackerSummary[]>(() => {
    const e = this.elaborado();
    return [
      { label: 'Elaborado por', actionBy: e?.usuario ?? '', date: e?.fecha ?? '' },
      { label: 'Verificado por', actionBy: '', date: '' },
      { label: 'Aprobado por', actionBy: '', date: '' },
    ];
  });
  readonly avisoMensaje = signal('Se agregó a la lista correctamente.');
  /** Identificadores únicos de tipos y subtipos (las filas se editan y borran por id, no por posición). */
  private siguienteId = 1;
  private nuevoId(): string {
    return String(this.siguienteId++);
  }
  /** Tipo en edición (null = se está creando uno) y copia de cómo estaba, para saber si hubo cambios. */
  readonly editandoTipoId = signal<string | null>(null);
  private instantaneaTipo = '';
  readonly editandoSubtipoId = signal<string | null>(null);
  private instantaneaSubtipo = '';
  /** Borrado pendiente de confirmar. */
  readonly borrado = signal<{ de: 'tipo' | 'subtipo'; ids: string[] } | null>(null);
  private readonly grillaTipos = viewChild('grillaTipos', { read: GrillaCatalogoComponent });
  /** Tipo abierto en modo visualización, o null cuando se ve la lista. */
  readonly detalle = signal<TipoAgregado | null>(null);
  /** Tipos aceptados (con sus subtipos). Por ahora solo viven en memoria. */
  readonly tipos = signal<TipoAgregado[]>([]);
  private avisoTemporizador?: ReturnType<typeof setTimeout>;

  readonly columnasTipos: GrillaColumna[] = [
    { key: 'codigo', label: 'Código TIF', widthClass: 'w-[150px]' },
    { key: 'tipo', label: 'Tipo', widthClass: 'w-[180px]' },
    { key: 'abreviatura', label: 'Abreviatura', widthClass: 'w-[180px]' },
    { key: 'descripcion', label: 'Descripción', widthClass: 'w-[260px]' },
    { key: 'esInstrumento', label: 'Instrumento financiero', widthClass: 'w-[200px]' },
    { key: 'subtipos', label: 'Subtipos', widthClass: 'w-[160px]' },
    { key: 'fechaDesde', label: 'Fecha desde', widthClass: 'w-[170px]', grupo: 'Vigencia' },
    { key: 'fechaHasta', label: 'Fecha hasta', widthClass: 'w-[170px]', grupo: 'Vigencia' },
  ];
  readonly columnasSubtipos: GrillaColumna[] = [
    { key: 'codigoSif', label: 'Código SIF', widthClass: 'w-[150px]' },
    { key: 'subtipo', label: 'Subtipo', widthClass: 'w-[180px]' },
    { key: 'abreviatura', label: 'Abreviatura', widthClass: 'w-[180px]' },
    { key: 'descripcion', label: 'Descripción', widthClass: 'w-[250px]' },
    { key: 'registroOperaciones', label: 'Reg. operaciones', widthClass: 'w-[180px]', tooltip: 'Registro de operaciones' },
    { key: 'permitirEjecutora', label: 'Permitir registrar a la ejecutora', widthClass: 'w-[180px]', tooltip: 'Permitir registrar a la ejecutora' },
    { key: 'pregunta', label: 'Pregunta para determinar si es activo', widthClass: 'w-[260px]', tooltip: 'Pregunta para determinar si es activo' },
    { key: 'fechaInicioVigencia', label: 'Campo para fecha inicio de vigencia', widthClass: 'w-[260px]', tooltip: 'Campo para fecha inicio de vigencia' },
    { key: 'condicionesComplementarias', label: 'Campo para registro de condiciones financieras complementarias', widthClass: 'w-[260px]', tooltip: 'Campo para registro de condiciones financieras complementarias' },
  ];

  /** Los tipos aceptados como filas: el primer subtipo y, si hay más, «+N»; las fechas como dd/mm/aaaa. */
  readonly filasTipos = computed<GrillaFila[]>(() =>
    this.tipos().map(({ id, tipo, subtipos }) => ({
      id,
      codigo: tipo.codigo,
      tipo: tipo.tipo,
      abreviatura: tipo.abreviatura,
      descripcion: tipo.descripcion,
      esInstrumento: tipo.esInstrumento === 'SI' ? 'Si' : 'No',
      subtipos: subtipos.length ? subtipos[0].subtipo + (subtipos.length > 1 ? ` +${subtipos.length - 1}` : '') : '-',
      fechaDesde: this.formatearFecha(tipo.fechaDesde),
      fechaHasta: this.formatearFecha(tipo.fechaHasta),
    })),
  );
  readonly subtipo = signal<FormularioSubtipo>({ ...SUBTIPO_VACIO });
  /** Subtipos aceptados del tipo en edición (su listado en pantalla se arma en el paso siguiente). */
  readonly subtipos = signal<FormularioSubtipo[]>([]);
  /** Subtipos aceptados del tipo en edición, ya como filas de la grilla. */
  readonly filasSubtipos = computed<GrillaFila[]>(() => this.aFilasSubtipos(this.subtipos()));
  readonly subtipoValido = computed(() => {
    const f = this.subtipo();
    return Boolean(f.codigoSif.trim() && f.subtipo.trim() && f.abreviatura.trim() && f.descripcion.trim() && f.pregunta.trim());
  });
  readonly form = signal<FormularioTipo>({ ...FORMULARIO_VACIO });
  /** Vigencia «SI»: exige las dos fechas; «NO»: las fechas se deshabilitan y se vacían. */
  readonly vigente = computed(() => this.form().vigente === 'SI');
  readonly sinVigencia = computed(() => this.form().vigente === 'NO');
  readonly formularioValido = computed(() => {
    const f = this.form();
    const datos = Boolean(f.codigo.trim() && f.tipo.trim() && f.abreviatura.trim() && f.descripcion.trim() && f.esInstrumento);
    const fechas = !this.vigente() || Boolean(f.fechaDesde && f.fechaHasta);
    return datos && fechas;
  });

  abrirFormulario(): void {
    this.form.set({ ...FORMULARIO_VACIO });
    this.subtipos.set([]);
    this.editandoTipoId.set(null);
    this.formularioAbierto.set(true);
  }

  /** Con el tipo en edición, «Aceptar» espera a que haya algún cambio; para volver sin cambiar está «Cancelar». */
  readonly puedeAceptarTipo = computed(() => this.formularioValido() && (!this.editandoTipoId() || this.hayCambiosTipo()));
  private hayCambiosTipo(): boolean {
    return JSON.stringify({ f: this.form(), s: this.subtipos() }) !== this.instantaneaTipo;
  }

  /** Acepta el tipo con los subtipos agregados (o guarda los cambios si se editaba) y avisa con el snackbar. */
  aceptarTipo(): void {
    const editando = this.editandoTipoId();
    if (editando) {
      this.tipos.update((lista) => lista.map((t) => (t.id === editando ? { id: t.id, tipo: this.form(), subtipos: this.subtipos() } : t)));
    } else {
      this.tipos.update((lista) => [...lista, { id: this.nuevoId(), tipo: this.form(), subtipos: this.subtipos() }]);
    }
    this.subtipos.set([]);
    this.editandoTipoId.set(null);
    this.formularioAbierto.set(false);
    this.avisar(editando ? 'Los cambios se han guardado con éxito.' : 'Se agregó a la lista correctamente.');
  }

  /** Abre el formulario del tipo elegido, con sus datos y subtipos, para editarlo. */
  editarTipo(id: string): void {
    const tipo = this.tipos().find((t) => t.id === id);
    if (!tipo) return;
    this.form.set({ ...tipo.tipo });
    this.subtipos.set(tipo.subtipos.map((s) => ({ ...s })));
    this.instantaneaTipo = JSON.stringify({ f: this.form(), s: this.subtipos() });
    this.editandoTipoId.set(id);
    this.formularioAbierto.set(true);
  }

  /** «Aceptar» del modal: asigna el número, fija la fecha y hora y pasa la solicitud a «Elaborado». */
  grabar(): void {
    const ahora = new Date();
    const dos = (n: number) => String(n).padStart(2, '0');
    const fecha = `${dos(ahora.getDate())}/${dos(ahora.getMonth() + 1)}/${ahora.getFullYear()}    ${dos(ahora.getHours())}:${dos(ahora.getMinutes())}:${dos(ahora.getSeconds())}`;
    TiposInstrumentosSolicitudComponent.correlativo += 1;
    this.elaborado.set({
      numero: String(TiposInstrumentosSolicitudComponent.correlativo).padStart(4, '0'),
      fecha,
      usuario: this.currentUser.name.toUpperCase(),
    });
    this.modalGrabar.set(false);
    this.avisoElaborado.set(true);
    this.mostrarAviso();
  }

  private avisar(mensaje: string): void {
    this.avisoElaborado.set(false);
    this.avisoMensaje.set(mensaje);
    this.mostrarAviso();
  }

  private mostrarAviso(): void {
    this.avisoAbierto.set(true);
    clearTimeout(this.avisoTemporizador);
    this.avisoTemporizador = setTimeout(() => this.avisoAbierto.set(false), 6000);
  }

  pedirBorrado(de: 'tipo' | 'subtipo', ids: string[]): void {
    this.borrado.set({ de, ids });
  }

  cancelarBorrado(): void {
    this.borrado.set(null);
  }

  /** «Aceptar» del modal: quita los ítems elegidos y avisa unos segundos. */
  confirmarBorrado(): void {
    const pendiente = this.borrado();
    if (!pendiente) return;
    const quitar = new Set(pendiente.ids);
    if (pendiente.de === 'tipo') {
      this.tipos.update((lista) => lista.filter((t) => !quitar.has(t.id)));
    } else {
      this.subtipos.update((lista) => lista.filter((s) => !quitar.has(s.id)));
    }
    this.borrado.set(null);
    this.avisar('El item ha sido eliminado de la lista.');
  }

  cancelarFormulario(): void {
    this.subtipos.set([]);
    this.editandoTipoId.set(null);
    this.formularioAbierto.set(false);
  }

  /** `2025-08-19` → `19/08/2025`; vacío → `vacio` («-» en la grilla, «--/--/----» en el detalle). */
  formatearFecha(valor: string, vacio = '-'): string {
    const [anio, mes, dia] = valor.split('-');
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : vacio;
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
  }

  /** Convierte los subtipos en filas con las opciones de los radios ya en el texto que se ve. */
  aFilasSubtipos(lista: FormularioSubtipo[]): GrillaFila[] {
    return lista.map((f) => ({
      id: f.id,
      codigoSif: f.codigoSif,
      subtipo: f.subtipo,
      abreviatura: f.abreviatura,
      descripcion: f.descripcion,
      registroOperaciones: this.etiqueta(this.opcionesRegistroOperaciones, f.registroOperaciones),
      permitirEjecutora: this.etiqueta(this.opcionesSiNoSubtipo, f.permitirEjecutora),
      pregunta: f.pregunta,
      fechaInicioVigencia: this.etiqueta(this.opcionesFechaInicio, f.fechaInicioVigencia),
      condicionesComplementarias: this.etiqueta(this.opcionesCondiciones, f.condicionesComplementarias),
    }));
  }

  abrirDetalle(id: string): void {
    this.avisoAbierto.set(false);
    this.detalle.set(this.tipos().find((t) => t.id === id) ?? null);
  }

  cerrarDetalle(): void {
    this.detalle.set(null);
  }

  private etiqueta(opciones: { label: string; value: string }[], valor: string): string {
    return opciones.find((o) => o.value === valor)?.label ?? '';
  }

  abrirSubtipo(): void {
    this.subtipo.set({ ...SUBTIPO_VACIO });
    this.editandoSubtipoId.set(null);
    this.subtipoAbierto.set(true);
  }

  editarSubtipo(id: string): void {
    const actual = this.subtipos().find((s) => s.id === id);
    if (!actual) return;
    this.subtipo.set({ ...actual });
    this.instantaneaSubtipo = JSON.stringify(this.subtipo());
    this.editandoSubtipoId.set(id);
    this.subtipoAbierto.set(true);
  }

  cerrarSubtipo(): void {
    this.subtipoAbierto.set(false);
  }

  /** Editando un subtipo, «Aceptar» espera a que haya algún cambio. */
  readonly puedeAceptarSubtipo = computed(
    () => this.subtipoValido() && (!this.editandoSubtipoId() || JSON.stringify(this.subtipo()) !== this.instantaneaSubtipo),
  );

  aceptarSubtipo(): void {
    const editando = this.editandoSubtipoId();
    if (editando) {
      this.subtipos.update((lista) => lista.map((s) => (s.id === editando ? { ...this.subtipo() } : s)));
      this.grillaSubtiposCmp()?.limpiarSeleccion();
      this.avisar('Los cambios se han guardado con éxito.');
    } else {
      this.subtipos.update((lista) => [...lista, { ...this.subtipo(), id: this.nuevoId() }]);
    }
    this.editandoSubtipoId.set(null);
    this.cerrarSubtipo();
    // La grilla queda debajo del formulario: se lleva a la vista para que se note el subtipo recién agregado.
    setTimeout(() => this.grillaSubtipos()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  actualizarSubtipo<K extends keyof FormularioSubtipo>(campo: K, valor: FormularioSubtipo[K]): void {
    this.subtipo.update((f) => ({ ...f, [campo]: valor }));
  }

  actualizar<K extends keyof FormularioTipo>(campo: K, valor: FormularioTipo[K]): void {
    this.form.update((f) => {
      const siguiente = { ...f, [campo]: valor };
      // Sin vigencia no hay fechas: se vacían al elegir «NO».
      return campo === 'vigente' && valor === 'NO' ? { ...siguiente, fechaDesde: '', fechaHasta: '' } : siguiente;
    });
  }

  cancelar(): void {
    void this.router.navigateByUrl(PROCESS_ROUTE);
  }
}
