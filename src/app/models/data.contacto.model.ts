export class DataContacto{
    private _fecha:Date;
    private _tratamiento:string;
    private _nombre:string;
    private _telefono:string;
    private _email:string;
    private _origen:string;
    private _observaciones:string;

    get fecha():Date{
        return this._fecha;
    }

    set fecha(fecha:Date){
        this._fecha = fecha;
    }

    get tratamiento():string{
        return this._tratamiento;
    }

    set tratamiento(tratamiento:string){
        this._tratamiento = tratamiento;
    }

    get nombre():string{
        return this._nombre;
    }

    set nombre(nombre:string){
        this._nombre = nombre;
    }

    get telefono():string{
        return this._telefono;
    }

    set telefono(telefono:string){
        this._telefono = telefono;
    }

    get email():string{
        return this._email;
    }

    set email(email:string){
        this._email = email;
    }

    get origen():string{
        return this._origen;
    }

    set origen(origen:string){
        this._origen = origen;
    }

    get observaciones():string{
        return this._observaciones;
    }

    set observaciones(observaciones:string){
        this._observaciones = observaciones;
    }
}
