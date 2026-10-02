import { Component, OnInit } from '@angular/core';
import { Orden, OrdenesService } from '../../services/ordenes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {

  historial: Orden[] = [];
  selectedVentaId: number | null = null;
  totalDia: number = 0;

  constructor(private ordenesService: OrdenesService) { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.historial = this.ordenesService.getHistorial();
  }

  toggleDetalles(id: number) {

    if (this.selectedVentaId === id) {
      this.selectedVentaId = null;
    } else {
      this.selectedVentaId = id;
    }

  }

  limpiarTodo() {

    const confirmar = confirm('¿Deseas eliminar el historial?');
    if (confirmar) {

      this.ordenesService.limpiarOrdenes();
      this.historial = [];

    }
  }

  cerrarDia() {

    this.totalDia = this.historial.reduce(
      (total, venta) => total + Number(venta.total),
      0
    );

  }
}