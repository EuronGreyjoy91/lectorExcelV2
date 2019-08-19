import { DataContacto } from './data.contacto.model';

export class DataModel{

    private _file:File;
    private _dataContactos:DataContacto[];

    get file():File{
        return this._file;
    }

    set file(file:File){
        this._file = file;
    }

    get dataContactos():DataContacto[]{
        return this._dataContactos;
    }

    set dataContactos(dataContactos:DataContacto[]){
        this._dataContactos = dataContactos;
    }
}
