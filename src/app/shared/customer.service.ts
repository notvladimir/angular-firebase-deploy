import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from './customer';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const url = 'https://angular-firebase-deploy-6ea95-default-rtdb.firebaseio.com/customers';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customers: Customer[] = [];
  form: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(8)]],
      location: ['', Validators.required]
    });
  }

  insert(): void {
    const customer: Customer = this.form.value;

    this.http.post<Customer>(`${url}.json`, customer, httpOptions).subscribe(
      res => {
        customer.key = res.name;
        this.customers.push(customer);
        console.log(this.customers);
      },
      err => console.log(err)
    );
  }

  getList(): void {
    this.http.get<Customer[]>(`${url}.json`, httpOptions).subscribe(res => {
      Object.keys(res).forEach(key => this.customers.push({ key, ...res[key] }));
    });
  }

  update(customer: Customer): Observable<Customer> {
    const { key, ...restOfCustomer } = customer;
    return this.http.put<Customer>(`${url}/${key}.json`, restOfCustomer, httpOptions);
  }

  delete(customer: Customer): void {
    this.http.delete<void>(`${url}/${customer.key}.json`, httpOptions).subscribe(
      () => this.customers.splice(this.customers.indexOf(customer), 1),
      err => console.log(err)
    );
  }

  resetTemp(customer: Customer): void {
    customer = {
      key: null,
      name: null,
      email: null,
      mobile: null,
      location: null
    };
  }
}
