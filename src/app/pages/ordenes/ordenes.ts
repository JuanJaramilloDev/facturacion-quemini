import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService, Orden } from '../../services/ordenes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordenes',
  imports: [CommonModule],
  templateUrl: './ordenes.html',
  styleUrl: './ordenes.css',
})
export class Ordenes {

  ordenes: Orden[] = [];

  constructor(
    private ordenesService: OrdenesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ordenes = this.ordenesService.obtenerOrdenes();
  }

  async entregar(id: number) {

    const { value: metodoPago } = await Swal.fire({
      title: '¿Cómo pagó el cliente?',
      html: `
        <div class="metodo-pago-grid">
          <label class="metodo-pago-opcion">
            <input type="radio" name="metodoPago" value="efectivo" hidden>
            <span class="metodo-pago-icono">💵</span>
            <span class="metodo-pago-texto">Efectivo</span>
          </label>
          <label class="metodo-pago-opcion">
            <input type="radio" name="metodoPago" value="nequi" hidden>
            <span class="metodo-pago-icono">📱</span>
            <span class="metodo-pago-texto">Nequi</span>
          </label>
        </div>
      `,
      didOpen: () => {

        const contenedor = Swal.getHtmlContainer();
        const opciones = contenedor?.querySelectorAll<HTMLLabelElement>('.metodo-pago-opcion');

        opciones?.forEach(opcion => {
          opcion.addEventListener('click', () => {
            opciones.forEach(o => o.classList.remove('metodo-pago-seleccionado'));
            opcion.classList.add('metodo-pago-seleccionado');
          });
        });
      },
      preConfirm: () => {

        const seleccionado = Swal.getHtmlContainer()
          ?.querySelector<HTMLInputElement>('input[name="metodoPago"]:checked');

        if (!seleccionado) {
          Swal.showValidationMessage('Selecciona un método de pago');
          return;
        }

        return seleccionado.value as 'nequi' | 'efectivo';
      },
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      background: '#2d2d2d',
      color: '#ffffff',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'metodo-pago-popup'
      }
    });

    if (metodoPago) {
      this.ordenesService.marcarComoEntregada(id, metodoPago as 'nequi' | 'efectivo');
      this.ordenes = this.ordenesService.obtenerOrdenes();
      this.cdr.detectChanges();
    }
  }

  imprimir(orden: Orden) {

    const productos = this.obtenerLineasProducto(orden);

    const ventana = window.open('', '_blank', 'width=320,height=600');

    if (!ventana) {
      return;
    }

    const filas = productos
      .map(p => `<div class="linea"><span>${p.nombre}</span><span>x${p.cantidad}</span></div>`)
      .join('');

    ventana.document.write(`
      <html>
        <head>
          <title>Pedido #${orden.numeroOrden}</title>
          <style>
            @page { size: 58mm auto; margin: 0; }
            * { box-sizing: border-box; }
            body {
              width: 58mm;
              margin: 0;
              padding: 6px;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #000;
            }
            h2 {
              text-align: center;
              margin: 0 0 4px;
              font-size: 14px;
            }
            .pedido {
              text-align: center;
              margin-bottom: 8px;
              font-weight: bold;
            }
            .linea {
              display: flex;
              justify-content: space-between;
              padding: 2px 0;
              border-bottom: 1px dashed #000;
            }
            .total {
              margin-top: 8px;
              text-align: right;
              font-weight: bold;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <h2>${orden.cliente}</h2>
          <div class="pedido">Pedido #${orden.numeroOrden}</div>
          ${filas}
          <div class="total">Total: $${(orden.total ?? 0).toLocaleString('es-CO')}</div>
        </body>
      </html>
    `);

    ventana.document.close();
    ventana.focus();

    setTimeout(() => {
      ventana.print();
      ventana.close();
    }, 250);
  }

  private obtenerLineasProducto(orden: Orden): { nombre: string; cantidad: number }[] {

    const items: { nombre: string; cantidad: number }[] = [
      { nombre: 'Mini Hamburguesa', cantidad: orden.miniHamburguesas - (orden.hamburguesasDobles ?? 0) },
      { nombre: 'Mini Hamb. Doble', cantidad: orden.hamburguesasDobles ?? 0 },
      { nombre: 'Mini Perro', cantidad: orden.miniPerros },
      { nombre: 'Mini Arepa', cantidad: orden.miniArepas },
      { nombre: 'Papas Pequeñas', cantidad: orden.papasPequenas },
      { nombre: 'Papas Grandes', cantidad: orden.papasGrandes },
      { nombre: 'Papas Combo', cantidad: orden.papasCombo },
      { nombre: 'Gaseosa 250ml', cantidad: orden.gaseosa250 },
      { nombre: 'Gaseosa 500ml', cantidad: orden.gaseosa500 },
      { nombre: 'Agua', cantidad: orden.agua },
    ];

    return items.filter(item => item.cantidad > 0);
  }

  editar(orden: Orden) {

    this.ordenesService.setOrdenEditando(orden);

    this.router.navigate(['/']);
  }

  get totalHamburguesas(): number {
    return this.ordenes.reduce(
      (total, orden) => total + orden.miniHamburguesas,
      0
    );
  }

  get totalPerros(): number {
    return this.ordenes.reduce(
      (total, orden) => total + orden.miniPerros,
      0
    );
  }

  get totalArepas(): number {
    return this.ordenes.reduce(
      (total, orden) => total + orden.miniArepas,
      0
    );
  }

  get totalPapasGrandes(): number {
    return this.ordenes.reduce(
      (total, orden) => total + orden.papasGrandes + orden.papasCombo, 0
    );
  }

  get totalPapasPequenas(): number {
    return this.ordenes.reduce(
      (total, orden) => total + orden.papasPequenas, 0
    );
  }

  eliminarOrden(id: number) {

    const confirmar = confirm('¿Deseas eliminar esta orden?');

    if (confirmar) {

      this.ordenesService.eliminarOrden(id);
      this.ordenes = this.ordenesService.obtenerOrdenes();

    }

  }

}