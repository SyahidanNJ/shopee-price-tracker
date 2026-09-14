import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  template: `
    <div class="card" style="color: #d32f2f;">
      <strong>Error:</strong> {{ message }}
    </div>
  `
})
export class ErrorComponent {
  @Input() message: string = 'Something went wrong';
}
