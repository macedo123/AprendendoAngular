import { Usuario } from './acesso/usuario.model';
import * as firebase from 'firebase'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AutenticacaoService{

    public token_id:string

    constructor(private router: Router){
    }
    public cadastrarUsuario(usuario:Usuario):Promise<any>{
        // console.log("chegamos ate o serviço: ", usuario)
        return firebase.auth()
            .createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any)=>{

                //remover senha do atributo senha do objeto usuario
                delete usuario.senha

                //registrando dados complementares do usuario no path email na base 64
                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                    .set(usuario)
            })
            .catch((error:any)=>{
                console.log(error)
            })
    }

    public autenticar(email: string, senha: string): void{
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta:any)=>{
                firebase.auth().currentUser.getIdToken()
                    .then((idToken : any)=>{
                        this.token_id = idToken
                        localStorage.setItem('idToken', idToken)
                        sessionStorage.setItem('idToken', idToken)
                        this.router.navigate(['/home'])
                    })
            })
            .catch((error: any)=>{
                console.log(error)
            })
    }

    public autenticado(): boolean{
        if(this.token_id === undefined && localStorage.getItem('idToken')!== null){
            this.token_id = localStorage.getItem('idToken')
        }
        return this.token_id !== undefined
    }
}