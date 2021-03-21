import { Component, OnInit } from '@angular/core';
import { Customer } from '../shared/customer';
import { CustomerService } from '../shared/customer.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {

  private editCustomer: Customer = {
    key: null,
    name: null,
    email: null,
    mobile: null,
    location: null
  };

  isEditPos: number | null;

  constructor(public svc: CustomerService) { }

  ngOnInit(): void {  
    this.svc.getList();
  }

  editMode(index: number): void {
    this.svc.resetTemp(this.editCustomer);
    this.isEditPos = index;
  }

  cancelEdit(): void {
    this.isEditPos = null;
    this.svc.resetTemp(this.editCustomer);
  }

  saveCustomer(customer: Customer): void {
    Object.keys(this.editCustomer).forEach(key => {
      if (this.editCustomer[key]) {
        customer[key] = this.editCustomer[key];
      }
    });
    this.svc.update(customer).subscribe(
      res => {
        console.log(res);
        this.isEditPos = null;
        this.svc.resetTemp(this.editCustomer);
      },
      err => console.log(err)
    );
  }

  deleteCustomer(customer: Customer): void {
    this.svc.delete(customer);
  }

  setValue(key, value): void {
    if (this.editCustomer[key] !== undefined) {
      this.editCustomer[key] = value;

      console.log(this.editCustomer);
    }
  }
}
