import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Event, Router, RoutesRecognized } from '@angular/router';

import { appTitle } from '@core/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.subscribeToRouterEventsToChangeTitle();
  }

  private subscribeToRouterEventsToChangeTitle(): void {
    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof RoutesRecognized) {
          const parentRouteData = event.state.root.firstChild?.data;
          if (parentRouteData) {
            this.titleService.setTitle(parentRouteData['title'] ?? appTitle);
          }
        }
      });
  }
}
