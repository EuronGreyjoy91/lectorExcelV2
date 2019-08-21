import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DataModel } from '../../models/data.model';
import { DataContacto } from '../../models/data.contacto.model';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  public formulario:FormGroup;
  public csvData:string = "";
  public parsedCsv:string[][];
  public processedData:DataModel[];
  public loading:boolean = false;

  constructor(private clipboardService: ClipboardService) {
      this.processedData = [];
  }

  ngOnInit() {

      this.formulario = new FormGroup({
          "file" : new FormControl("", Validators.required),
          "telefono" : new FormControl(""),
          "contactosMexico" : new FormControl(""),
          "incluirMail" : new FormControl("true"),
      });

  }

  public copiarRegistros(index:number){
      let string = "";

      this.processedData[index].dataContactos.forEach(dataContacto => {
         let linea = "";

         linea += this.processDate(dataContacto.fecha) + "\u200e" + "\t";
         linea += dataContacto.tratamiento + "\t";
         linea += dataContacto.nombre + "\t";
         linea += dataContacto.telefono + "\u200e" + "\t";

         if(this.formulario.value.incluirMail)
            linea += dataContacto.email + "\t";

         linea += dataContacto.origen + "\t";
         linea += dataContacto.observaciones + "\n";

         string += linea;
      });

      this.clipboardService.copyFromContent(string);

  }

  public processDate(date:Date):string{
      let month:any = date.getMonth() + 1;

      if(month < 10)
          month = "0" + month;

      return date.getDate() + "-" + month;
  }

  public resetForm(){
      this.formulario.reset({ incluirMail: true });
      this.processedData = [];
  }

  public onFileSelect(files: FileList) {
      this.processedData = [];
      console.log(this.formulario);

      if(this.formulario.valid){
          let telefono = this.formulario.value.telefono;
          let contactosMexico = this.formulario.value.contactosMexico != "" && this.formulario.value.contactosMexico != null ? this.formulario.value.contactosMexico : false;

          if(files && files.length > 0) {
              this.loading = true;

              setTimeout( () => {
                  for(let i:number = 0; i < files.length; i++){
                      let dataModel:DataModel = new DataModel();

                      let file : File = files.item(i);
                      dataModel.file = file;

                      let reader: FileReader = new FileReader();
                      reader.readAsText(file);
                      reader.onload = (e) => {
                          let csv: string = reader.result as string;

                          const CSV_SEPARATOR = /(?:[^\s"]+|"[^"]*")+/g;
                          const CSV = [];
                          const LINES = csv.split('\n');
                          let cols: string[];

                          LINES.forEach(element => {
                              cols = element.match(CSV_SEPARATOR);
                              CSV.push(cols);
                          });

                          this.parsedCsv = CSV;

                          let columnaNombre:number = null;
                          let columnaTelefono:number = null;
                          let columnaMail:number = null;

                          let index = 0;
                          this.parsedCsv[0].forEach(element => {
                              if(element === "full_name" || element === "nombre_completo")
                                  columnaNombre = index;
                              else if(element === "phone_number" || element === "número_de_teléfono")
                                  columnaTelefono = index;
                              else if(element === "email")
                                  columnaMail = index;

                              index++;
                          })

                          let dataContactos:DataContacto[] = [];
                          let limiteAlcanzado = false;

                          this.parsedCsv.forEach((row : any, j :any)  => {
                              let dataContacto:DataContacto;

                              if(row != null && j != 0 && !limiteAlcanzado){
                                  dataContacto = new DataContacto();
                                  dataContacto.fecha = new Date();
                                  dataContacto.tratamiento = "Clientes potenciales";
                                  dataContacto.nombre = row[columnaNombre];

                                  let nombre = row[columnaNombre];
                                  nombre = nombre.replace("á", "a")
                                  .replace("é", "e")
                                  .replace("í", "i")
                                  .replace("ó", "o")
                                  .replace("ú", "u")
                                  .replace("Á", "A")
                                  .replace("É", "E")
                                  .replace("Í", "I")
                                  .replace("Ó", "O")
                                  .replace("Ú", "U")
                                  .replace(/[^\w\s\ñ\Ñ]/gi, '')
                                  .trim();

                                  dataContacto.nombre = nombre;

                                  dataContacto.telefono = row[columnaTelefono];
                                  dataContacto.email = row[columnaMail];

                                  if(contactosMexico) {
                                      dataContacto.telefono = dataContacto.telefono.replace("p:", "");

                                      if(!dataContacto.telefono.startsWith("+"))
                                          dataContacto.telefono = "+" + dataContacto.telefono;

                                      if(telefono != null && telefono != "") {
                                          telefono = telefono.replace("p:", "");
                                          telefono = telefono.replace("\u200e", "").replace("\t", "");

                                          if(!telefono.startsWith("+"))
                                              telefono = "+" + telefono;
                                      }
                                  }
                                  else {
                                      dataContacto.telefono = dataContacto.telefono.replace("+", "").replace("p:", "");

                                      if(dataContacto.telefono.length >= 12){
                                          if(dataContacto.telefono.startsWith("549") || dataContacto.telefono.startsWith("540"))
                                              dataContacto.telefono = dataContacto.telefono.substring(3);
                                          else if(dataContacto.telefono.startsWith("54"))
                                              dataContacto.telefono = dataContacto.telefono.substring(2);
                                      }

                                      if(telefono != null && telefono != "") {
                                          telefono = telefono.replace("+", "").replace("p:", "");
                                          telefono = telefono.replace("\u200e", "").replace("\t", "");

                                          if(telefono.length >= 12){
                                              if(telefono.startsWith("549") || telefono.startsWith("540"))
                                                  telefono = telefono.substring(3);
                                              else if(telefono.startsWith("54"))
                                                  telefono = telefono.substring(2);
                                          }
                                      }
                                  }

                                  dataContacto.origen = "Facebook";
                                  dataContacto.observaciones = "-";

                                  if(telefono != null && telefono != "")
                                      if(telefono.trim() == dataContacto.telefono.trim())
                                          limiteAlcanzado = true;

                                  if(!limiteAlcanzado)
                                      dataContactos.push(dataContacto);
                              }
                          });

                          dataModel.dataContactos = dataContactos;
                      }

                      this.processedData.push(dataModel);
                  }

                  this.loading = false;

              }, 500);
          }
      }
  }
}
