import { Component, Input, OnInit } from '@angular/core';
import { INavbarData } from '../helper';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { ServiceApiService } from '../services/service-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sublevel-menu',
  templateUrl: './sublevel-menu.component.html',
  styleUrls: ['./sublevel-menu.component.scss'],
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden',
        opacity: 0
      })),
      state('visible', style({
        height: '*',
        opacity: 1
      })),
      transition('visible <=> hidden', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routerLink: '',
    icon: '',
    label: '',
    items: [],
  }

  @Input() collapsed = false;
  @Input() animating!: boolean;
  @Input() expanded?: boolean;
  @Input() multiple: boolean = false;

  currentUrl: string = '';

  constructor(
    private serviceApiService: ServiceApiService,
    private router: Router
  ) {
    // Track current URL for active state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    // Initialize all submenu items as collapsed
    if (this.data.items) {
      this.data.items = this.data.items.map(item => ({
        ...item,
        expanded: false
      }));
    }
  }

  handleClick(item: any): void {
    // If item has no children and has routerLink, navigate
    if ((!item.items || item.items.length === 0) && item.routerLink) {
      this.router.navigate([item.routerLink]);
      return;
    }

    if (!this.multiple) {
      // Close other submenus at the same level
      if (this.data.items) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }

    if (item.items && item.items.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  isActive(item: INavbarData): boolean {
    // Check if current URL matches this item's routerLink
    if (item.routerLink && this.currentUrl.includes(item.routerLink)) {
      return true;
    }

    // Check if any child item is active
    if (item.items) {
      return item.items.some(child => this.isActive(child));
    }

    return false;
  }

  getItemCount(item: INavbarData): number {
    if (item.items) {
      return item.items.length;
    }
    return 0;
  }
}
