/**
 * Datos del catálogo de tipos y subtipos de instrumentos financieros del MIF, tomados del archivo
 * `mif-instrumentos.xlsx` (hojas «ti» y «sub tipo»). Son datos de ejemplo para la demostración: no hay backend.
 * Las celdas «-» del Excel vienen como cadena vacía.
 */

/** Tipo de instrumento financiero (hoja «ti»). */
export interface TipoInstrumento {
  /** Código TIF. */
  codigo: string;
  nombre: string;
  abreviatura: string;
  descripcion: string;
  /** ¿Es instrumento financiero? (la «Caja» no lo es). */
  esInstrumento: boolean;
  /** Identificado en la Ley de endeudamiento. */
  leyEndeudamiento: boolean;
}

/** Subtipo de un tipo de instrumento (hoja «sub tipo»). */
export interface SubtipoInstrumento {
  codigo: string;
  /** Código TIF del tipo al que pertenece. */
  codigoTipo: string;
  nombre: string;
  abreviatura: string;
  resumen: string;
  /** Marca de operación (`ST_FALG_OPE`). */
  operativo: boolean;
  /** Pregunta que se hace al registrar el instrumento (`DES_PREGUNTA_ACT`). */
  pregunta: string;
  /** Marcado con «X» en la columna LEY SNE. */
  leySne: boolean;
}

export const TIPOS_INSTRUMENTOS: TipoInstrumento[] = [
  { codigo: '0', nombre: 'CAJA', abreviatura: 'CAJA', descripcion: 'DINERO EN CAJA', esInstrumento: false, leyEndeudamiento: false },
  { codigo: '1', nombre: 'CUENTA CORRIENTE', abreviatura: 'CTA CTE', descripcion: 'CUENTA CORRIENTE', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '2', nombre: 'CUENTA DE AHORRO', abreviatura: 'CTA AHORRO', descripcion: 'CUENTA DE AHORRO', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '3', nombre: 'CUENTA A PLAZO', abreviatura: 'CTA PLAZO', descripcion: 'CUENTA A PLAZO', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '4', nombre: 'CERTIFICADO DE DEPÓSITO', abreviatura: 'CERT. DEPOSITO', descripcion: 'CERTIFICADO DE DEPÓSITO', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '5', nombre: 'CERTIFICADO BANCARIO', abreviatura: 'CERT. BANCARIO', descripcion: 'CERTIFICADO BANCARIO', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '6', nombre: 'PAPELES COMERCIALES', abreviatura: 'PAP. COMERCIALES', descripcion: 'PAPELES COMERCIALES', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '7', nombre: 'BONOS', abreviatura: 'BONOS', descripcion: 'BONOS', esInstrumento: true, leyEndeudamiento: true },
  { codigo: '8', nombre: 'PARTICIPACIONES', abreviatura: 'PART FIDE', descripcion: 'PARTICIPACIONES', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '9', nombre: 'LETRAS', abreviatura: 'LETRAS', descripcion: 'LETRAS', esInstrumento: true, leyEndeudamiento: true },
  { codigo: '10', nombre: 'PAGARÉS', abreviatura: 'PAGARÉS', descripcion: 'PAGARÉS', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '11', nombre: 'FACTURA NEGOCIABLE', abreviatura: 'FC NEGOCIABLE', descripcion: 'FACTURA NEGOCIABLE', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '12', nombre: 'NOTAS', abreviatura: 'NOTAS', descripcion: 'NOTAS', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '13', nombre: 'OPERACIONES DE REPORTE', abreviatura: 'OPE. REPORTE', descripcion: 'OPERACIONES DE REPORTE', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '14', nombre: 'ACCIONES', abreviatura: 'ACCIONES', descripcion: 'ACCIONES', esInstrumento: true, leyEndeudamiento: true },
  { codigo: '15', nombre: 'PRÉSTAMOS', abreviatura: 'PRESTAMOS', descripcion: 'PRÉSTAMOS', esInstrumento: true, leyEndeudamiento: true },
  { codigo: '16', nombre: 'CARTA FIANZA', abreviatura: 'C. FIANZA', descripcion: 'CARTA FIANZA', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '17', nombre: 'CARTA DE CRÉDITO', abreviatura: 'C. CRÉDITO', descripcion: 'CARTA DE CRÉDITO', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '18', nombre: 'PÓLIZA DE SEGURO', abreviatura: 'P. SEGURO', descripcion: 'PÓLIZA DE SEGURO', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '19', nombre: 'DERIVADOS FINANCIEROS', abreviatura: 'DER. FINANC.', descripcion: 'DERIVADOS FINANCIEROS', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '20', nombre: 'DOCUMENTOS VALORADOS', abreviatura: 'DOC VALOR', descripcion: 'DOCUMENTOS EMITIDOS POR EL TESORO PARA EL RESPALDO DE PAGO DE PROYECTOS -CIPRL Y CIPGN- U OTROS -DOCUMENTO CANCELATORIO-', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '21', nombre: 'TRASPASOS DE RECURSOS', abreviatura: 'TRA', descripcion: 'PRÉSTAMOS BAJO LA MODALIDAD DE CONVENIO DE TRASPASO DE RECURSOS', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '22', nombre: 'DEPÓSITOS ENTREGADOS EN GARANTÍA', abreviatura: 'DEPGARAN', descripcion: 'CORRESPONDE AL DINERO ENTREGADO EN GARANTÍA Y QUE VA A SER RECUPERADO EN UN PERIODO DE TIEMPO, EL MISMO QUE DEBE ESTAR SEÑALADO EN UN CONTRATO O DOCUMENTO LEGAL.', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '23', nombre: 'FONDOS FCR', abreviatura: 'FONDOS FCR', descripcion: 'FONDOS ACREEDORES DE LOS RECURSOS ADMINISTRADOS POR EL FCR', esInstrumento: true, leyEndeudamiento: false },
  { codigo: '24', nombre: 'INVERSIONES MEF', abreviatura: 'INV MEF', descripcion: 'INVERSIONES/RECURSOS PROPIEDAD DEL MEF', esInstrumento: true, leyEndeudamiento: false },
];

export const SUBTIPOS_INSTRUMENTOS: SubtipoInstrumento[] = [
  { codigo: '0', codigoTipo: '0', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '', leySne: false },
  { codigo: '1', codigoTipo: '1', nombre: '', abreviatura: '', resumen: 'CUENTA CORRIENTES EN ENTIDADES DEL SISTEMA FINANCIERO', operativo: false, pregunta: '¿Usted va a registrar un instrumento financiero del ACTIVO?', leySne: false },
  { codigo: '34', codigoTipo: '1', nombre: 'CUT', abreviatura: 'CUT', resumen: 'CUT', operativo: false, pregunta: '', leySne: false },
  { codigo: '2', codigoTipo: '2', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted va a registrar un instrumento financiero del ACTIVO?', leySne: false },
  { codigo: '3', codigoTipo: '3', nombre: 'DPF NO ESTRUCTURADA', abreviatura: 'NO ESTRUCTURADA', resumen: 'NO ESTRUCTURADA', operativo: false, pregunta: '¿Usted va a registrar un instrumento financiero del ACTIVO?', leySne: false },
  { codigo: '35', codigoTipo: '3', nombre: 'DPF ESTRUCTURADA', abreviatura: 'ESTRUCTURADA', resumen: 'ESTRUCTURADA', operativo: false, pregunta: '¿Usted va a registrar un instrumento financiero del ACTIVO?', leySne: false },
  { codigo: '4', codigoTipo: '4', nombre: '', abreviatura: '', resumen: '', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: false },
  { codigo: '5', codigoTipo: '5', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: false },
  { codigo: '6', codigoTipo: '6', nombre: '', abreviatura: '', resumen: '', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: false },
  { codigo: '7', codigoTipo: '7', nombre: 'CORPORATIVOS', abreviatura: 'BÁSICO', resumen: 'BÁSICO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '8', codigoTipo: '7', nombre: 'GARANTIZADO', abreviatura: 'GARANTIZADO', resumen: 'GARANTIZADO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '9', codigoTipo: '7', nombre: 'CONVERTIBLE', abreviatura: 'CONVERTIBLE', resumen: 'CONVERTIBLE', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '10', codigoTipo: '7', nombre: 'ARRENDAMIENTO FINANCIERO', abreviatura: 'ARRENDAMIENTOF', resumen: 'ARRENDAMIENTO FINANCIERO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '11', codigoTipo: '7', nombre: 'ESTRUCTURADO', abreviatura: 'ESTRUCTURADO', resumen: 'ESTRUCTURADO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '12', codigoTipo: '7', nombre: 'HÍBRIDO', abreviatura: 'HÍBRIDO', resumen: 'HÍBRIDO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '13', codigoTipo: '7', nombre: 'SUBORDINADO', abreviatura: 'SUBORDINADO', resumen: 'SUBORDINADO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '14', codigoTipo: '7', nombre: 'TITULIZADO', abreviatura: 'TITULIZADO', resumen: 'TITULIZADO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '15', codigoTipo: '7', nombre: 'SOBERANOS', abreviatura: 'SOBERANOS', resumen: 'SOBERANOS', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '16', codigoTipo: '7', nombre: 'GLOBALES', abreviatura: 'GLOBALES', resumen: 'GLOBALES', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '39', codigoTipo: '7', nombre: 'BONO DE RECONOCIMIENTO', abreviatura: 'BONO REC', resumen: 'BONO DE RECONOCIMIENTO ONP', operativo: true, pregunta: '¿EL INSTRUMENTO ES UN ACTIVO?', leySne: true },
  { codigo: '40', codigoTipo: '7', nombre: 'HIPOTECARIO', abreviatura: 'HIPOTECARIO', resumen: 'BONO HIPOTECARIO', operativo: true, pregunta: '¿Usted es el TENEDOR del instrumento?', leySne: true },
  { codigo: '42', codigoTipo: '7', nombre: 'OTROS BONOS DEL TESORO', abreviatura: 'OTROS BONOS DEL TESORO', resumen: 'OTROS BONOS DEL TESORO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '17', codigoTipo: '8', nombre: 'EN FONDOS MUTUOS', abreviatura: 'EN FONDOS MUTUOS', resumen: 'EN FONDOS MUTUOS', operativo: true, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: false },
  { codigo: '18', codigoTipo: '8', nombre: 'DE INVERSIÓN', abreviatura: 'DE INVERSIÓN', resumen: 'DE INVERSIÓN', operativo: true, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: false },
  { codigo: '19', codigoTipo: '8', nombre: 'EN TITULIZACIONES', abreviatura: 'EN TITULIZACIONES', resumen: 'EN TITULIZACIONES', operativo: true, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: false },
  { codigo: '20', codigoTipo: '8', nombre: 'EN FIDEICOMISOS', abreviatura: 'EN FIDEICOMISOS', resumen: 'EN FIDEICOMISOS', operativo: true, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: true },
  { codigo: '21', codigoTipo: '9', nombre: 'COMERCIAL', abreviatura: 'COMERCIAL', resumen: 'COMERCIAL', operativo: false, pregunta: '¿Usted es el BENEFICIARIO del Instrumento?', leySne: true },
  { codigo: '22', codigoTipo: '9', nombre: 'DEL TESORO', abreviatura: 'DEL TESORO', resumen: 'DEL TESORO', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '23', codigoTipo: '10', nombre: '', abreviatura: 'PAGBANC', resumen: '', operativo: false, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: true },
  { codigo: '24', codigoTipo: '11', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: false },
  { codigo: '25', codigoTipo: '12', nombre: '', abreviatura: '', resumen: '', operativo: true, pregunta: '¿Usted es el ACREEDOR del Instrumento?', leySne: false },
  { codigo: '26', codigoTipo: '13', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el COLOCADOR DE FONDOS/VALORES del Instrumento?', leySne: false },
  { codigo: '27', codigoTipo: '14', nombre: '', abreviatura: '', resumen: '', operativo: true, pregunta: '¿Usted es el TENEDOR del Instrumento?', leySne: true },
  { codigo: '28', codigoTipo: '15', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el ACREEDOR del Instrumento?\nCaso contrario el instrumento se constituye como un PASIVO financiero', leySne: true },
  { codigo: '29', codigoTipo: '16', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el BENEFICIARIO / ACREEDOR de la Carta Fianza?', leySne: false },
  { codigo: '30', codigoTipo: '17', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el BENEFICIARIO del Instrumento?', leySne: false },
  { codigo: '31', codigoTipo: '18', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el BENEFICIARIO del Instrumento?', leySne: false },
  { codigo: '32', codigoTipo: '19', nombre: 'DE TASA DE INTERÉS', abreviatura: 'DE TASA DE INTERÉS', resumen: 'DE TASA DE INTERÉS', operativo: false, pregunta: '¿Usted es el EMISOR del Instrumento?', leySne: false },
  { codigo: '33', codigoTipo: '19', nombre: 'DE TIPO DE CAMBIO', abreviatura: 'DE TIPO DE CAMBIO', resumen: 'DE TIPO DE CAMBIO', operativo: false, pregunta: '¿Usted es el EMISOR del Instrumento?', leySne: false },
  { codigo: '36', codigoTipo: '20', nombre: 'CERTIFICADOS DE INVERSIÓN PÚBLICA REGIONAL Y LOCAL', abreviatura: 'CIPRL', resumen: 'EL CERTIFICADO DE INVERSIÓN PÚBLICA REGIONAL Y LOCAL ES UN DOCUMENTO EMITIDO POR EL MINISTERIO DE ECONOMÍA Y FINANZAS A TRAVÉS DEL CUAL SE RECONOCE EL MONTO INVERTIDO POR LA EMPRESA PRIVADA EN EL PROYECTO FINANCIADO BAJO LA MODALIDAD DE OBRAS POR IMPUESTOS.', operativo: false, pregunta: '¿Su entidad es EMISORA del certificado?\nEn caso su respuesta sea NO, su entidad es SOLICITANTE del certificado y constituye un pasivo', leySne: false },
  { codigo: '48', codigoTipo: '20', nombre: 'CERTIFICADO DE INVERSIÓN PÚBLICA GOBIERNO NACIONAL', abreviatura: 'CIPGN', resumen: 'EL CERTIFICADO DE INVERSIÓN PÚBLICA GOBIERNO NACIONAL ES UN DOCUMENTO EMITIDO POR EL MINISTERIO DE ECONOMÍA Y FINANZAS A TRAVÉS DEL CUAL SE RECONOCE EL MONTO INVERTIDO POR LA EMPRESA PRIVADA EN EL PROYECTO FINANCIADO BAJO LA MODALIDAD DE OBRAS POR IMPUESTOS.', operativo: false, pregunta: '¿Su entidad es EMISORA del certificado?\nEn caso su respuesta sea NO, su entidad es SOLICITANTE del certificado y constituye un pasivo', leySne: false },
  { codigo: '49', codigoTipo: '20', nombre: 'DOCUMENTOS CANCELATORIOS', abreviatura: 'DCTP', resumen: 'DOCUMENTOS CANCELATORIOS - TESORO PUBLICO', operativo: false, pregunta: '¿Su entidad es EMISORA del documento?\nEs caso su respuesta sea NO, su entidad es SOLICITANTE del documento y constituye un pasivo', leySne: false },
  { codigo: '37', codigoTipo: '21', nombre: '', abreviatura: 'TRA', resumen: 'PRÉSTAMOS BAJO LA MODALIDAD DE CONVENIO DE TRASPASO DE RECURSOS', operativo: false, pregunta: '¿Usted es el ACREEDOR del instrumento financiero?\nEn caso su respuesta sea NO el instrumento constituye un PASIVO', leySne: false },
  { codigo: '38', codigoTipo: '22', nombre: '', abreviatura: 'DEPGARAN', resumen: 'CORRESPONDE A DINERO ENTREGADO EN GARANTÍA Y QUE VA A SER RECUPERADO EN UN PERIODO DE TIEMPO, EL MISMO QUE DEBE ESTAR SEÑALADO EN UN CONTRATO O DOCUMENTO LEGAL.', operativo: false, pregunta: '¿Usted es el ACREEDOR del instrumento financiero?\nEn caso su respuesta sea NO el instrumento constituye un PASIVO', leySne: false },
  { codigo: '41', codigoTipo: '23', nombre: '', abreviatura: '', resumen: '', operativo: false, pregunta: '¿Usted es el ACREEDOR del instrumento?', leySne: false },
  { codigo: '43', codigoTipo: '24', nombre: 'SUSCRIPCIÓN DE RECURSOS', abreviatura: 'SUS RECURSOS', resumen: 'RECURSOS QUE EL TESORO TRANSFIERE A ORGANISMOS MULTILATERALES A LOS CUALES PERTENECE', operativo: false, pregunta: '¿Usted es el ACREEDOR del instrumento?', leySne: true },
  { codigo: '44', codigoTipo: '24', nombre: 'CONTRIBUCIONES Y APORTES', abreviatura: 'CONTR Y APORTES', resumen: 'CONTRIBUCIONES QUE REALIZA EL TESORO A LOS ORGANISMOS MULTILATERALES A LOS QUE PERTENECE', operativo: false, pregunta: '¿Usted es el TENEDOR del instrumento?', leySne: true },
  { codigo: '45', codigoTipo: '24', nombre: 'MANTENIMIENTO DE VALOR', abreviatura: 'MANT VALOR', resumen: 'APORTES QUE REALIZA EL TESORO PARA MANTENER EL VALOR DE SUS CONTRIBUCIONES DEBIDO A FLUCTUACIONES DE TIPO DE CAMBIO', operativo: false, pregunta: '¿Usted es el TENEDOR del instrumento?', leySne: true },
  { codigo: '46', codigoTipo: '24', nombre: 'SUSCRIPCION DE ACCIONES', abreviatura: 'SUS ACCIONES', resumen: 'ACCIONES OTORGADAS AL ESTADO PERUANO POR PARTE DE ORGANISMOS MULTILATERALES.\nIMPORTANTE: SÓLO PARA USO DEL MEF.', operativo: false, pregunta: '¿Usted es el TENEDOR del instrumento?', leySne: true },
  { codigo: '47', codigoTipo: '24', nombre: 'REPARTO DE UTILIDADES', abreviatura: 'REP UTILIDADES', resumen: 'UTILIDADES EN NUEVAS ACCIONES QUE SON OTORGADAS AL TESORO POR PARTE DE LOS ORGANISMOS MULTILATERALES A LOS QUE PERTENECE', operativo: false, pregunta: '¿Usted es el TENEDOR del instrumento?', leySne: true },
];

/** Subtipos de un tipo, por su código TIF. */
export function subtiposDeTipo(codigoTipo: string): SubtipoInstrumento[] {
  return SUBTIPOS_INSTRUMENTOS.filter((s) => s.codigoTipo === codigoTipo);
}
