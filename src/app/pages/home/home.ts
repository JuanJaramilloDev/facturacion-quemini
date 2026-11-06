import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdenesService } from '../../services/ordenes';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  cliente = '';
  numeroOrden = 0;

  miniHamburguesas = 0;
  hamburguesasDobles = 0;
  miniPerros = 0;
  miniArepas = 0;
  sandwiches = 0;

  papasPequenas = 0;
  papasGrandes = 0;
  papasCombo = 0;

  gaseosa250 = 0;
  gaseosa500 = 0;
  agua = 0;

  precioHamburguesa = 8000;
  precioHamburguesaDoble = 11000;
  precioPerro = 7000;
  precioArepa = 9000;
  precioSandwich = 10000;

  precioPapasPequenas = 2000;
  precioPapasGrandes = 5000;
  precioPapasCombo = 4000;

  precioGaseosa250 = 2500;
  precioGaseosa500 = 4000;
  precioAgua = 1000;
  editandoId: number | null = null;

  aumentar(campo: keyof Home) {
    // No puede haber más dobles que hamburguesas
    if (campo === 'hamburguesasDobles' && this.hamburguesasDobles >= this.miniHamburguesas) {
      return;
    }
    (this[campo] as number)++;
  }

  disminuir(campo: keyof Home) {
    if ((this[campo] as number) > 0) {
      (this[campo] as number)--;
    }
    if (this.hamburguesasDobles > this.miniHamburguesas) {
      this.hamburguesasDobles = this.miniHamburguesas;
    }
  }

  get total(): number {
    return (
      (this.miniHamburguesas - this.hamburguesasDobles) * this.precioHamburguesa +
      this.hamburguesasDobles * this.precioHamburguesaDoble +
      this.miniPerros * this.precioPerro +
      this.miniArepas * this.precioArepa +
      this.sandwiches * this.precioSandwich +
      this.papasPequenas * this.precioPapasPequenas +
      this.papasGrandes * this.precioPapasGrandes +
      this.papasCombo * this.precioPapasCombo +
      this.gaseosa250 * this.precioGaseosa250 +
      this.gaseosa500 * this.precioGaseosa500 +
      this.agua * this.precioAgua
    );
  }

  confirmarPedido() {

    const orden: any = {
      id: this.editandoId ?? Date.now(),
      numeroOrden: this.numeroOrden,
      cliente: this.cliente,

      miniHamburguesas: this.miniHamburguesas,
      hamburguesasDobles: this.hamburguesasDobles,
      miniPerros: this.miniPerros,
      miniArepas: this.miniArepas,
      sandwiches: this.sandwiches,

      papasPequenas: this.papasPequenas,
      papasGrandes: this.papasGrandes,
      papasCombo: this.papasCombo,

      gaseosa250: this.gaseosa250,
      gaseosa500: this.gaseosa500,
      agua: this.agua,

      total: this.total,

      fecha: new Date(),
      estado: 'activa'
    };

    if (this.editandoId) {

      this.ordenesService.actualizarOrden(orden);

    } else {

      this.ordenesService.agregarOrden(orden);

    }

    this.ordenesService.limpiarOrdenEditando();
    this.editandoId = null;
    this.numeroOrden = 0;

    this.router.navigate(['/ordenes']);
  }

  constructor(
    private ordenesService: OrdenesService,
    private router: Router
  ) { }

  ngOnInit() {

    const orden = this.ordenesService.getOrdenEditando();

    if (orden) {

      this.editandoId = orden.id;
      this.numeroOrden = orden.numeroOrden;

      this.cliente = orden.cliente;

      this.miniHamburguesas = orden.miniHamburguesas;
      this.hamburguesasDobles = orden.hamburguesasDobles ?? 0;
      this.miniPerros = orden.miniPerros;
      this.miniArepas = orden.miniArepas;
      this.sandwiches = orden.sandwiches ?? 0;

      this.papasPequenas = orden.papasPequenas;
      this.papasGrandes = orden.papasGrandes;
      this.papasCombo = orden.papasCombo ?? 0;

      this.gaseosa250 = orden.gaseosa250;
      this.gaseosa500 = orden.gaseosa500;
      this.agua = orden.agua ?? 0;
    }
  }
}