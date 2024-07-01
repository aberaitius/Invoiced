import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-quote-display',
  templateUrl: './quote-display.component.html',
  styleUrls: ['./quote-display.component.css']
})
export class QuoteDisplayComponent implements OnInit {
  quoteItems: any[] = [];
  total: number = 0;

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
    this.quoteService.getQuote().subscribe(data => {
      this.quoteItems = data.items;
      this.total = data.total;
    });
  }
}
