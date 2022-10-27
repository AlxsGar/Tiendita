import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productForm !: FormGroup;
  categoriesList = ["Bebidas", "Dulces", "Bizcocho", "Papas", "Galletas", "Frutas"];
  actionBtn : String = "Ingresar";

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public editData : any, 
  private api : ApiService, private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required],
      productCategory : ['', Validators.required],
      productBuy : ['', Validators.required],
      productSell : ['', Validators.required],
    });

    //console.log(this.editData);

    if(this.editData){
      this.actionBtn = "Actualizar";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['productCategory'].setValue(this.editData.productCategory);
      this.productForm.controls['productBuy'].setValue(this.editData.productBuy);
      this.productForm.controls['productSell'].setValue(this.editData.productSell);
    }
  }

  addProduct(){
    //console.log(this.productForm.value);
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value).subscribe({
          next:(res) => {
            alert("Se agrego correctamente");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error : (res) => {
            alert("Error, vuelva a intentar");
          }
        })
      }
    }else{
      this.updateProduct();
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next:(res)=>{
        alert("Se actualizo correctamente");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error al actualizar");
      }
    })
  }

}
