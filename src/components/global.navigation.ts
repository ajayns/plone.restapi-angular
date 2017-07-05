import { Component, OnInit } from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';

@Component({
  selector: 'plone-global-navigation',
  template: `<ul>
  <li *ngFor="let link of links" [ngClass]="{'active': link.active}">
    <a [traverseTo]="link.path">{{ link.title }}</a>
  </li>
</ul>`
})
export class GlobalNavigation extends TraversingComponent implements OnInit {

  links: any[] = [];

  constructor(
    public services: Services,
  ) {
    super(services);
  }

  ngOnInit() {
    super.ngOnInit();
    this.services.resource.navigation().subscribe(data => {
      if (data && data[0] && data[0].items) {
        this.links = data[0].items.filter(item => {
          return !item.properties || !item.properties.exclude_from_nav;
        })
        .map(item => {
          return {
            title: item.title,
            path: this.services.configuration.urlToPath(item.url),
          };
        });
      }
    });
  }

  onTraverse(target) {
    this.links.map(link => {
      if (!target.path || target.path === '/') {
        link.active = (!link.path || link.path === '/');
      } else {
        link.active = link.path.startsWith(target.path);
      }
    });
  }

}
