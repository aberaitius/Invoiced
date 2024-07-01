import { Component } from '@angular/core';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css']
})
export class QuoteFormComponent {
  isInvoice: boolean = false;
  businessName: string = '';
  logoUrl: string = '';
  customer: string = '';
  billingAddress: string = '';
  invoiceNumber: string = '';
  date: string = '';
  paymentTerms: string = '';
  footer: string = '';
  items: any[] = [{ item: '', qty: 0, price: 0 }];
  item: string = '';
  qty: number = 0;
  price: number = 0;
  generatedQuote: any;

  constructor(private quoteService: QuoteService) { }

  toggleInvoice() {
    this.isInvoice = !this.isInvoice;
  }

  addItem() {
    this.items.push({ item: '', qty: 0, price: 0 });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  onSubmit() {
    const quoteData = {
      type: this.isInvoice ? 'invoice' : 'quote',
      businessName: this.businessName,
      logoUrl: this.logoUrl,
      customer: this.customer,
      billingAddress: this.billingAddress,
      invoiceNumber: this.isInvoice ? this.invoiceNumber : '',
      date: this.date,
      paymentTerms: this.paymentTerms,
      items: this.items,
      footer: this.footer,
      total: this.items.reduce((acc, item) => acc + item.qty * item.price, 0)
    };

    this.generatedQuote = quoteData;

    this.quoteService.createQuote(quoteData).subscribe(response => {
      console.log('Quote generated:', response);
    }, error => {
      console.error('Error saving quote:', error);
      // Handle offline scenario by displaying the generated quote
      console.log('Offline: Quote generated locally.');
    });
  }
}
