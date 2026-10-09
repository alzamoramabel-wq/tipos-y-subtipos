import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { FormTableSearchComponent } from '../../../../../shared/components/form-table-search/form-table-search.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { TooltipDirective } from '../../../../../shared/ui/tooltip/tooltip.directive';

/** Columna de la grilla. Con `grupo`, su cabecera cuelga de un título compartido (p. ej. «Vigencia»). */
export interface GrillaColumna {
  key: string;
  label: string;
  widthClass: string;
  grupo?: string;
  /** Texto del globo al pasar el cursor por la cabecera; sin él, solo aparece si la cabecera está cortada. */
  tooltip?: string;
}

/** Fila de la grilla: el texto de cada celda por `key`, más un `id` único. */
export type GrillaFila = Record<string, string> & { id: string };

type GrupoCabecera = { titulo: string; columnas: GrillaColumna[] };

/**
 * Grilla del formulario de la solicitud (Figma «Tipos / Subtipos de instrumentos financieros»): buscador, casilla de
 * seleccionar todo, tabla con la columna de casillas fija a la izquierda y scroll horizontal, y paginación abajo.
 * Las columnas con el mismo `grupo` comparten una cabecera superior. Es de solo lectura: la búsqueda filtra en memoria
 * al pulsar Enter o la lupa.
 */
@Component({
  selector: 'siaf-grilla-catalogo',
  standalone: true,
  imports: [ButtonComponent, FormTableSearchComponent, PaginationComponent, TooltipDirective],
  template: `
    <div class="flex flex-col gap-siaf-md">
      @if (showSearch) {
        <siaf-form-table-search [value]="busqueda()" (valueChange)="buscar($event)" />
      }

      @if (showSelection) {
        <div class="flex min-h-10 items-center gap-siaf-xs">
          <label class="inline-flex size-10 cursor-pointer items-center justify-center">
            <input
              class="size-4 accent-[var(--sys-color-icon-states-enabled)]"
              type="checkbox"
              aria-label="Seleccionar filas"
              [checked]="todasMarcadas()"
              [indeterminate]="algunasMarcadas()"
              (change)="marcarTodas($any($event.target).checked)"
            />
          </label>
          <!-- Con filas elegidas aparecen Editar (solo con una) y Borrar item, separados por una línea (Figma). -->
          @if (editable && seleccion().size > 0) {
            <span class="mx-siaf-xs h-6 w-px bg-[var(--sys-color-divider-default)]" aria-hidden="true"></span>
            <siaf-button
              variant="text"
              size="md"
              icon="edit"
              [iconOnly]="true"
              ariaLabel="Editar"
              siafTooltip="Editar"
              tooltipMode="always"
              [disabled]="seleccion().size > 1"
              (click)="pedirEdicion()"
            />
            <siaf-button
              variant="text"
              size="md"
              icon="delete"
              [iconOnly]="true"
              ariaLabel="Borrar item"
              siafTooltip="Borrar item"
              tooltipMode="always"
              (click)="pedirBorrado()"
            />
          }
        </div>
      }

      @if (showTopPagination) {
        <div class="flex justify-end">
          <siaf-pagination
            navigation="Activate"
            position="Top"
            [page]="pagina()"
            [pageSize]="filasPorPagina()"
            [totalItems]="filtradas().length"
            [totalPages]="totalPaginas()"
            (previous)="irAPagina(pagina() - 1)"
            (next)="irAPagina(pagina() + 1)"
          />
        </div>
      }

      <div class="siaf-table-scroll min-w-0">
        <table class="w-full table-fixed border-collapse text-left text-sm" [style.min-width.px]="anchoMinimo">
          <thead>
            <tr class="bg-surface-high text-[10px] font-bold uppercase text-text">
              @if (showSelection) {
                <th
                  class="sticky left-0 z-[2] w-12 rounded-tl-siaf-sm bg-surface-high px-siaf-sm py-siaf-sm after:pointer-events-none after:absolute after:inset-y-0 after:-right-2 after:w-2 after:bg-[linear-gradient(to_right,var(--sys-color-divider-default),transparent)]"
                  [attr.rowspan]="hayGrupos ? 2 : 1"
                ></th>
              }
              @for (item of cabecera; track $index) {
                @if (item.grupo; as g) {
                  <th class="border-b border-l border-[var(--sys-color-divider-strong)] px-siaf-md py-siaf-sm text-center" [attr.colspan]="g.columnas.length">{{ g.titulo }}</th>
                } @else {
                  <th class="truncate px-siaf-md py-siaf-sm text-left" [siafTooltip]="item.columna!.tooltip ?? ''" [class]="item.columna!.widthClass" [attr.rowspan]="hayGrupos ? 2 : 1">{{ item.columna!.label }}</th>
                }
              }
            </tr>
            @if (hayGrupos) {
              <tr class="bg-surface-high text-[10px] font-bold uppercase text-text">
                @for (columna of columnasDeGrupo; track columna.key) {
                  <th class="truncate border-l border-[var(--sys-color-divider-strong)] px-siaf-md py-siaf-sm text-left" [siafTooltip]="columna.tooltip ?? ''" [class]="columna.widthClass">{{ columna.label }}</th>
                }
              </tr>
            }
          </thead>
          <tbody>
            @for (fila of filasPagina(); track fila.id) {
              <tr
                class="h-[58px] border-b border-[var(--sys-color-divider-default)]"
                [class.bg-surface]="!seleccion().has(fila.id)"
                [class.hover:bg-[var(--sys-color-bg-states-light-hover)]]="!seleccion().has(fila.id)"
                [class.bg-[var(--sys-color-bg-states-light-selected)]]="seleccion().has(fila.id)"
                [class.cursor-pointer]="clickable"
                [attr.tabindex]="clickable ? 0 : null"
                (click)="clickable && rowClick.emit(fila.id)"
                (keydown.enter)="clickable && rowClick.emit(fila.id)"
              >
                @if (showSelection) {
                  <td class="sticky left-0 z-[1] bg-surface px-siaf-sm py-siaf-xs after:pointer-events-none after:absolute after:inset-y-0 after:-right-2 after:w-2 after:bg-[linear-gradient(to_right,var(--sys-color-divider-default),transparent)]" [class.shadow-[inset_0_0_0_9999px_var(--sys-color-bg-states-light-selected)]]="seleccion().has(fila.id)" (click)="$event.stopPropagation()" (keydown.enter)="$event.stopPropagation()">
                    <input
                      class="size-4 accent-[var(--sys-color-icon-states-enabled)]"
                      type="checkbox"
                      [attr.aria-label]="'Seleccionar fila ' + (filas().indexOf(fila) + 1)"
                      [checked]="seleccion().has(fila.id)"
                      (change)="marcar(fila.id, $any($event.target).checked)"
                    />
                  </td>
                }
                @for (columna of columnas; track columna.key) {
                  <td class="px-siaf-md py-siaf-sm align-middle text-[var(--sys-color-text-neutral-medium)]" [class.border-l]="!!columna.grupo" [class.border-[var(--sys-color-divider-strong)]]="!!columna.grupo">{{ fila[columna.key] }}</td>
                }
              </tr>
            } @empty {
              <tr>
                <td class="px-siaf-md py-siaf-lg text-[var(--sys-color-text-neutral-medium)]" [attr.colspan]="columnas.length + (showSelection ? 1 : 0)">No se encontraron registros.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <siaf-pagination
        navigation="Activate"
        position="Bottom"
        [rowPage]="true"
        [page]="pagina()"
        [pageSize]="filasPorPagina()"
        [totalItems]="filtradas().length"
        [totalPages]="totalPaginas()"
        [rowsPerPage]="filasPorPagina()"
        (previous)="irAPagina(pagina() - 1)"
        (next)="irAPagina(pagina() + 1)"
        (rowsPerPageChange)="cambiarFilasPorPagina($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrillaCatalogoComponent {
  /** Buscador sobre la tabla. */
  @Input() showSearch = true;
  /** Casilla de seleccionar todo y casillas por fila (columna fija a la izquierda). */
  @Input() showSelection = true;
  /** Las filas se pueden abrir: cursor de mano, foco con Tab y `rowClick` con clic o Enter. */
  @Input() clickable = false;
  /** Muestra Editar y Borrar item cuando hay filas elegidas. */
  @Input() editable = false;
  /** Paginación también arriba de la tabla (la vista de solo lectura de la solicitud elaborada). */
  @Input() showTopPagination = false;
  @Output() rowClick = new EventEmitter<string>();
  /** Editar la fila elegida (solo con una). */
  @Output() editar = new EventEmitter<string>();
  /** Borrar las filas elegidas. */
  @Output() borrar = new EventEmitter<string[]>();

  columnas: GrillaColumna[] = [];
  /** Primera fila de la cabecera: columnas sueltas y títulos de grupo, en el orden de `columns`. */
  cabecera: { columna?: GrillaColumna; grupo?: GrupoCabecera }[] = [];
  columnasDeGrupo: GrillaColumna[] = [];
  hayGrupos = false;
  private anchoColumnas = 0;
  get anchoMinimo(): number {
    return (this.showSelection ? 48 : 0) + this.anchoColumnas;
  }

  @Input({ required: true }) set columns(valor: GrillaColumna[]) {
    this.columnas = valor;
    this.hayGrupos = valor.some((c) => c.grupo);
    this.columnasDeGrupo = valor.filter((c) => c.grupo);
    this.cabecera = [];
    for (const c of valor) {
      if (!c.grupo) {
        this.cabecera.push({ columna: c });
      } else {
        const previo = this.cabecera[this.cabecera.length - 1]?.grupo;
        if (previo && previo.titulo === c.grupo) previo.columnas.push(c);
        else this.cabecera.push({ grupo: { titulo: c.grupo, columnas: [c] } });
      }
    }
    // Suma del ancho de cada columna (`w-[NNNpx]`); a eso se le suma la columna de casillas.
    this.anchoColumnas = valor.reduce((suma, c) => suma + Number(/w-\[(\d+)px\]/.exec(c.widthClass)?.[1] ?? 160), 0);
  }

  readonly filas = signal<GrillaFila[]>([]);
  /** Un `@Input() set` que alimenta signals: los `computed` de abajo dependen de él. */
  @Input({ required: true }) set rows(valor: GrillaFila[]) {
    this.filas.set(valor);
    // Si una fila desaparece (se borró), sale también de la selección.
    const vigentes = new Set(valor.map((f) => f.id));
    const quedan = [...this.seleccion()].filter((id) => vigentes.has(id));
    if (quedan.length !== this.seleccion().size) this.seleccion.set(new Set(quedan));
  }

  pedirEdicion(): void {
    const [id] = this.seleccion();
    if (id !== undefined) this.editar.emit(id);
  }

  pedirBorrado(): void {
    this.borrar.emit([...this.seleccion()]);
  }

  /** Vacía la selección (p. ej. al terminar de editar la fila elegida). */
  limpiarSeleccion(): void {
    this.seleccion.set(new Set());
  }

  readonly busqueda = signal('');
  readonly pagina = signal(1);
  readonly filasPorPagina = signal(25);
  readonly seleccion = signal<ReadonlySet<string>>(new Set());

  readonly filtradas = computed(() => {
    const texto = this.normalizar(this.busqueda());
    if (!texto) return this.filas();
    return this.filas().filter((f) => this.columnas.some((c) => this.normalizar(f[c.key] ?? '').includes(texto)));
  });
  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / this.filasPorPagina())));
  readonly filasPagina = computed(() => {
    const desde = (this.pagina() - 1) * this.filasPorPagina();
    return this.filtradas().slice(desde, desde + this.filasPorPagina());
  });
  readonly todasMarcadas = computed(() => this.filtradas().length > 0 && this.filtradas().every((f) => this.seleccion().has(f.id)));
  readonly algunasMarcadas = computed(() => !this.todasMarcadas() && this.filtradas().some((f) => this.seleccion().has(f.id)));

  buscar(texto: string): void {
    this.busqueda.set(texto);
    this.pagina.set(1);
  }

  marcar(id: string, marcada: boolean): void {
    const nueva = new Set(this.seleccion());
    if (marcada) nueva.add(id);
    else nueva.delete(id);
    this.seleccion.set(nueva);
  }

  marcarTodas(marcada: boolean): void {
    const nueva = new Set(this.seleccion());
    for (const f of this.filtradas()) {
      if (marcada) nueva.add(f.id);
      else nueva.delete(f.id);
    }
    this.seleccion.set(nueva);
  }

  irAPagina(pagina: number): void {
    this.pagina.set(Math.min(this.totalPaginas(), Math.max(1, pagina)));
  }

  cambiarFilasPorPagina(cantidad: number): void {
    this.filasPorPagina.set(cantidad);
    this.pagina.set(1);
  }

  private normalizar(valor: string): string {
    return valor.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }
}
