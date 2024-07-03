import { Component } from '@angular/core';

interface Item {
  qty: number;
  item: string;
  price: number;
  additional: string[];
}

interface Column {
  header: string;
}

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css']
})
export class QuoteFormComponent {
  businessName: string = '';
  logoUrl: string | ArrayBuffer | null = null;
  customer: string = '';
  billingAddress: string = '';
  invoiceNumber: string = '';
  date: string = '';
  paymentTerms: string = '';
  currency: string = 'R';
  footer: string = '';
  isInvoice: boolean = true;

  items: Item[] = [];
  additionalColumns: Column[] = [];
  showColumns = {
    qty: true,
    unitPrice: true,
    total: true
  };

  generatedQuote = {
    items: [] as Item[],
    total: 0
  };

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxDimension = 150;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            this.logoUrl = canvas.toDataURL(file.type);
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  }

  onChange() {
    this.generatedQuote.items = this.items.map(item => ({
      ...item,
      additional: this.additionalColumns.map((_, index) => item.additional[index] || '')
    }));
    this.generatedQuote.total = this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  }

  toggleInvoice() {
    this.isInvoice = !this.isInvoice;
    this.onChange();
  }

  populateSampleData() {
    this.businessName = 'Sample Business';
    this.customer = 'John Doe';
    this.billingAddress = '123 Sample Street';
    this.invoiceNumber = 'INV12345';
    this.date = new Date().toISOString().substring(0, 10);
    this.paymentTerms = 'Net 30';
    this.items = [
      { qty: 2, item: 'Sample Item 1', price: 150, additional: ['First item note', 'nice to have'] },
      { qty: 1, item: 'Sample Item 2', price: 300, additional: ['Second item note', 'nice to have'] }
    ];
    this.additionalColumns = [{ header: 'Notes' }, { header: 'nice to have' }];
    this.footer = 'Thank you for your business!';
    this.onChange();
  }

  clearForm() {
    this.businessName = '';
    this.logoUrl = null;
    this.customer = '';
    this.billingAddress = '';
    this.invoiceNumber = '';
    this.date = '';
    this.paymentTerms = '';
    this.currency = 'R';
    this.footer = '';
    this.items = [];
    this.additionalColumns = [];
    this.showColumns = {
      qty: true,
      unitPrice: true,
      total: true
    };
    this.onChange();
  }

  addItem() {
    this.items.push({ qty: 1, item: '', price: 0, additional: [] });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.onChange();
  }

  addColumn() {
    this.additionalColumns.push({ header: '' });
    this.items.forEach(item => item.additional.push(''));
  }

  removeColumn(index: number) {
    this.additionalColumns.splice(index, 1);
    this.items.forEach(item => item.additional.splice(index, 1));
    this.onChange();
  }

  printQuote() {
    const printContents = document.getElementById('quote-preview')?.innerHTML;
    
    if (printContents) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow?.document.write('<html><head><title>Print Quote</title>');
      printWindow?.document.write('<style>');
      printWindow?.document.write(`
        .invoice-template {
          font-family: Arial, sans-serif;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .invoice-logo img {
          max-width: 150px;
          max-height: 150px;
          width: auto;
          height: auto;
        }
        .invoice-business {
          text-align: right;
        }
        .invoice-business h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .invoice-business p {
          margin: 5px 0;
          color: #777;
        }
        .invoice-details {
          margin-bottom: 20px;
        }
        .invoice-details h2 {
          margin: 0;
          font-size: 22px;
          color: #333;
        }
        .invoice-details p {
          margin: 5px 0;
          color: #555;
        }
        .invoice-items {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .invoice-items th, .invoice-items td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        .invoice-items th {
          background-color: #f9f9f9;
        }
        .invoice-footer {
          text-align: right;
          margin-top: 20px;
        }
        .invoice-footer p {
          margin: 5px 0;
          color: #777;
        }
        .invoice-footer h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
      `);
      printWindow?.document.write('</style>');
      printWindow?.document.write('</head><body >');
      printWindow?.document.write(printContents);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    }
  }
}
