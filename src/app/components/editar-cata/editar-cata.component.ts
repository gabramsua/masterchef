import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cata, User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import constants from 'src/constants';

@Component({
  selector: 'editar-cata',
  templateUrl: './editar-cata.component.html',
  styleUrls: ['./editar-cata.component.scss']
})
export class EditarCataComponent implements OnInit {
  @Output() dispatchGoBack = new EventEmitter<any>();
  @Input() cataParaEditar!: Cata;
  
  step = -1;
  
  imagenes: any[] = [];
  currentUser!: User;
  showSpinnerFoto = false;

  constructor(
    public _service: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  goBack() {
    this.dispatchGoBack.next(null);
  }
  save(acabada = false) {
    const cata: Cata = {
      id: this.cataParaEditar.id,
      nombre: this.cataParaEditar.nombre,
      telefono: this.cataParaEditar.telefono,
      fecha: this.cataParaEditar.fecha,
      isAlmuerzo: this.cataParaEditar.isAlmuerzo ?? false,

      nombreEntrante: this.cataParaEditar.nombreEntrante ?? '',
      descripcionEntrante: this.cataParaEditar.descripcionEntrante ?? '',
      fotoEntrante: this.cataParaEditar.fotoEntrante ?? '',

      nombrePrincipal: this.cataParaEditar.nombrePrincipal ?? '',
      descripcionPrincipal: this.cataParaEditar.descripcionPrincipal ?? '',
      fotoPrincipal: this.cataParaEditar.fotoPrincipal ?? '',

      nombrePostre: this.cataParaEditar.nombrePostre ?? '',
      descripcionPostre: this.cataParaEditar.descripcionPostre ?? '',
      fotoPostre: this.cataParaEditar.fotoPostre ?? '',

      votacionesAbiertas:  acabada ? false : this.cataParaEditar.votacionesAbiertas,
      acabada: acabada
    };

    this._service.update(constants.END_POINTS.CATAS, this.cataParaEditar.id, cata);
    this.goBack();
  }

  loadImage(event: any, plato: string){
    let archivo = event.target.files
    let reader = new FileReader()

    this.showSpinnerFoto = true;

    reader.readAsDataURL(archivo[0])
    reader.onloadend = () => {
      this.imagenes.push(reader.result)
      this.storageService.uploadImage(this.currentUser.telefono + '_' + Date.now(), reader.result)
      .then(urlImage => {
        console.log('URL SUBIDA', urlImage)
        switch(plato){
          case 'entrante': 
            this.cataParaEditar.fotoEntrante = urlImage;
            break;
          case 'principal':
            this.cataParaEditar.fotoPrincipal = urlImage;
            break;
          case 'postre':
            this.cataParaEditar.fotoPostre = urlImage;
            break;
        }
        this.showSpinnerFoto = false;
      })
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}