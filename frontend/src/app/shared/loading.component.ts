import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 24px;">Loading...</div>
    </div>
  `
})
export class LoadingComponent {}
