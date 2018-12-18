import { Component } from '@angular/core';

/**
 * Application root component
 *
 * @export
 * @class AppComponent
 */
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  /**
   * Application index page title
   *
   * @memberof AppComponent
   */
  public title = 'mann-stack-client';

  /**
   * Application theme name
   *
   * @memberof AppComponent
   */
  public theme = 'theme-default';
}
