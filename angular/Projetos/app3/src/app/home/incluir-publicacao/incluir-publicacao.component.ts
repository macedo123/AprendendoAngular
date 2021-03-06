import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Bd } from 'src/app/bd.service';
import * as firebase from 'firebase'
import { Progresso } from 'src/app/progresso.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number = 0

  public email: string
  private imagem:any

  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter<any>()
  
  public formulario : FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  })

  constructor(private bdService: Bd, public progresso: Progresso) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user)=>{
      this.email = user.email
    })
  }

  public publicar():void{
    this.bdService.publicar({
      titulo: this.formulario.value.titulo,
      email: this.email,
      imagem: this.imagem[0]
    })

    let acompanhementoUpload = interval(1500)
    let continua = new Subject()
    continua.next(true)

    acompanhementoUpload
    .pipe(takeUntil(continua))
    .subscribe(()=>{
      console.log(this.progresso.status)
      console.log(this.progresso.estado)
      this.progressoPublicacao =  'andamento'

      this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100)

      if(this.progresso.status === 'concluido'){
        this.progressoPublicacao =  'concluido'

        //emitir um evento do componente parent(home)
        this.atualizarTimeLine.emit()


        continua.next(false)
      }     
    })
  }

  public preparaImagemUpload(event: Event): void{
    this.imagem = (<HTMLInputElement>event.target).files
  }

  public fechouModal():void{
    this.progressoPublicacao = "pendente"
  }

}
