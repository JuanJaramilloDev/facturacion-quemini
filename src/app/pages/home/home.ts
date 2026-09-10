import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdenesService } from '../../services/ordenes';
import { OnInit } from '@angular/core';

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
  miniPerros = 0;
  miniArepas = 0;

  papasPequenas = 0;
  papasGrandes = 0;
  papasCombo = 0;

  gaseosa250 = 0;
  gaseosa500 = 0;
  agua = 0;

  precioHamburguesa = 7000;
  precioPerro = 6000;
  precioArepa = 8000;

  precioPapasPequenas = 2000;
  precioPapasGrandes = 5000;
  precioPapasCombo = 4000;

  precioGaseosa250 = 2000;
  precioGaseosa500 = 4000;
  precioAgua = 1000;
  editandoId: number | null = null;

  aumentar(campo: keyof Home) {
    (this[campo] as number)++;
  }

  disminuir(campo: keyof Home) {
    if ((this[campo] as number) > 0) {
      (this[campo] as number)--;
    }
  }

  get total(): number {
    return (
      this.miniHamburguesas * this.precioHamburguesa +
      this.miniPerros * this.precioPerro +
      this.miniArepas * this.precioArepa +
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
      miniPerros: this.miniPerros,
      miniArepas: this.miniArepas,

      papasPequenas: this.papasPequenas,
      papasGrandes: this.papasGrandes,
      papasCombo: this.papasCombo,

      gaseosa250: this.gaseosa250,
      gaseosa500: this.gaseosa500,
      agua: this.agua,

      total: this.total,

      fecha: new Date()
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
      this.miniPerros = orden.miniPerros;
      this.miniArepas = orden.miniArepas;

      this.papasPequenas = orden.papasPequenas;
      this.papasGrandes = orden.papasGrandes;

      this.gaseosa250 = orden.gaseosa250;
      this.gaseosa500 = orden.gaseosa500;
    }
  }
}