import { Oferta } from './shared/oferta.model';
import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import { URL_API } from './app.api';

@Injectable()
export class OfertaService{

    constructor(private http: HttpClient){}

    public ofertas : Array<Oferta>

    public getOfertas():Promise<Oferta[]>{
        return this.http.get<Oferta[]>(`${URL_API}/ofertas?destaque=true`)
            .toPromise()
            .then((resposta:any)=>resposta)
    }

    public getOfertasPorCategoria(categoria:string):Promise<Oferta[]>{
        return this.http.get<Oferta[]>(`${URL_API}/ofertas?categoria=${categoria}`)
            .toPromise()
            .then((resposta:any)=>resposta)
    }

    /**
     * getOfertaPorId
     */
    public getOfertaPorId(id: number):Promise<Oferta> {
        return this.http.get(`${URL_API}/ofertas?id=${id}`)
            .toPromise()
            .then((resposta: any)=>{
                // console.log(resposta.shift())
                return resposta[0]
        })
    }

    public getComoUsarOfertaPorId(id:number):Promise<string>{
    return this.http.get(`${URL_API}/como-usar?id=${id}`)
        .toPromise()
        .then((resposta: any)=>{
            return resposta[0]['descricao']
        })
    }

    public getOndeFicaOfertaPorId(id:number):Promise<string>{
        return this.http.get(`${URL_API}/onde-fica?id=${id}`)
            .toPromise()
            .then((resposta: any)=>{
                return resposta[0]['descricao']
            })
        }
}