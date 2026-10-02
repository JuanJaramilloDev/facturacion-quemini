import { Injectable } from '@angular/core';

export interface Orden {
  id: number;
  numeroOrden: number;
  cliente: string;
  miniHamburguesas: number;
  hamburguesasDobles: number;
  miniPerros: number;
  miniArepas: number;
  papasPequenas: number;
  papasGrandes: number;
  papasCombo: number;
  gaseosa250: number;
  gaseosa500: number;
  agua: number;
  total: number;
  fecha: Date;
  estado: 'activa' | 'entregada';
  metodoPago?: 'nequi' | 'efectivo';
}

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  private ordenes: Orden[] = [];
  private historial: Orden[] = [];
  private ordenEditando: Orden | null = null;
  private contadorOrdenes = 1;

  private guardar() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ordenes', JSON.stringify(this.ordenes));
      localStorage.setItem('historial', JSON.stringify(this.historial));
      localStorage.setItem('contadorOrdenes', this.contadorOrdenes.toString());
    }
  }

  constructor() {

    if (typeof window !== 'undefined') {

      const datos = localStorage.getItem('ordenes');

      if (datos) {
        const parsed = JSON.parse(datos);

        this.ordenes = parsed.map((o: any) => ({
          ...o,
          hamburguesasDobles: o.hamburguesasDobles ?? 0,
          fecha: new Date(o.fecha),
          estado: o.estado ?? 'activa'
        }));
      }
      const historial = localStorage.getItem('historial');

      if (historial) {
        this.historial = JSON.parse(historial).map((o: any) => ({
          ...o,
          hamburguesasDobles: o.hamburguesasDobles ?? 0
        }));
      }
      const contador = localStorage.getItem('contadorOrdenes');

      if (contador) {
        this.contadorOrdenes = Number(contador);
      }
    }
  }

  agregarOrden(orden: Orden) {

    const nuevaOrden: Orden = {
      ...orden,
      numeroOrden: this.contadorOrdenes,
      estado: 'activa'
    };

    this.contadorOrdenes++;

    this.ordenes.push(nuevaOrden);

    this.guardar();
  }

  actualizarOrden(ordenActualizada: Orden) {

    const index = this.ordenes.findIndex(
      o => o.id === ordenActualizada.id
    );

    if (index !== -1) {

      this.ordenes[index] = ordenActualizada;

      this.guardar();

    }
  }

  obtenerOrdenes(): Orden[] {
    return this.ordenes;
  }

  getHistorial(): Orden[] {
    return this.historial;
  }

  marcarComoEntregada(id: number, metodoPago: 'nequi' | 'efectivo') {

    const index = this.ordenes.findIndex(o => o.id === id);

    if (index !== -1) {

      const orden = this.ordenes[index];

      orden.estado = 'entregada';
      orden.metodoPago = metodoPago;

      this.ordenes.splice(index, 1);
      this.historial.push(orden);

      this.guardar();
    }
  }

  setOrdenEditando(orden: Orden) {
    this.ordenEditando = orden;
  }

  getOrdenEditando(): Orden | null {
    return this.ordenEditando;
  }

  eliminarOrden(id: number) {

    this.ordenes = this.ordenes.filter(
      orden => orden.id !== id
    );

    this.guardar();
  }

  limpiarOrdenes() {

    this.historial = [];
    this.contadorOrdenes = 1;

    this.guardar();
  }

  limpiarOrdenEditando() {
    this.ordenEditando = null;
  }
}