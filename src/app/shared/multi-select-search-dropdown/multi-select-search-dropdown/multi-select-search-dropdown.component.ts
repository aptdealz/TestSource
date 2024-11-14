import { Component, Input,OnChanges,OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-select-search-dropdown',
  templateUrl: './multi-select-search-dropdown.component.html',
  styleUrls: ['./multi-select-search-dropdown.component.scss']
})
export class MultiSelectSearchDropdownComponent implements OnInit,OnChanges {
  @Input('control') control: any;
  @Input() data: any;
  subcategoryFilteredOption:any;
constructor(public fb: FormBuilder){}
  ngOnInit() {
  this.subcategoryFilteredOption = this.data;
  }
ngOnChanges(){
  this.subcategoryFilteredOption = this.data;
}
  filterSub(event:any){
    const filterValue = event.target.value.toLowerCase();
    this.subcategoryFilteredOption =this.data.filter((option:any) => option.name.toLowerCase().includes(filterValue));
   }
   isOptionVisible(item:any){
   return this.subcategoryFilteredOption.find((ele:any )=> 
    ele.name == item.name
    )
   }
   setAllOptions(value:any){
    if(value){
      this.control?.patchValue([
        ...this.data.map((sub:any) => {
          return  sub.name ;
        }),
      ]);
    }
    else{
      this.control?.patchValue([]);
    }
   }
}
