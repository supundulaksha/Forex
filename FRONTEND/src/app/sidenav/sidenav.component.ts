import { Component, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
import { navbarData } from './nav-data';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';
import { INavbarData } from './helper';
import { ServiceApiService } from './services/service-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 }))
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('500ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(1turn)', offset: '1' }),
          ])
        )
      ]),
    ])
  ]
})
export class SidenavComponent implements OnInit {

  constructor(
    private serviceApiService: ServiceApiService,
    private router: Router
  ) {
    // Listen for route changes to update active state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveState();
    });
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData: INavbarData[] = [];
  multiple: boolean = false;
  searchQuery: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.serviceApiService.getNavbarData().subscribe((data) => {
      this.navData = data;
      this.updateActiveState(); // Update active state after loading data
    });
  }

  // Update active state for all menu items
  updateActiveState(): void {
    const currentUrl = this.router.url;

    this.navData.forEach(item => {
      // Reset expanded state
      if (item.expanded) {
        item.expanded = false;
      }

      // Check if this item or any of its children is active
      this.setItemActiveState(item, currentUrl);
    });
  }

  // Recursive function to set active state
  setItemActiveState(item: INavbarData, currentUrl: string): boolean {
    let isActive = false;

    // Check if the item itself has a matching routerLink
    if (item.routerLink && currentUrl.includes(item.routerLink)) {
      isActive = true;
      item.expanded = true; // Expand parent if active
    }

    // Check children
    if (item.items) {
      item.items.forEach(child => {
        if (this.setItemActiveState(child, currentUrl)) {
          isActive = true;
          item.expanded = true; // Expand parent if child is active
        }
      });
    }

    return isActive;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    // If item has no children and has routerLink, navigate
    if ((!item.items || item.items.length === 0) && item.routerLink) {
      this.router.navigate([item.routerLink]);
      return;
    }

    if (!this.multiple) {
      // Close other expanded menus
      this.navData.forEach(modelItem => {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      });
    }

    // Toggle current item
    if (item.items && item.items.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  // Check if item or any of its children is active
  isActive(data: INavbarData): boolean {
    return this.checkActiveState(data, this.router.url);
  }

  // Recursive function to check active state
  private checkActiveState(item: INavbarData, currentUrl: string): boolean {
    // Check if item itself is active
    if (item.routerLink && currentUrl.includes(item.routerLink)) {
      return true;
    }

    // Check children
    if (item.items) {
      return item.items.some(child => this.checkActiveState(child, currentUrl));
    }

    return false;
  }

  getItemCount(data: INavbarData): number {
    if (data.items) {
      return data.items.length;
    }
    return 0;
  }

  logout(): void {
    console.log('Logging out...');
    // Implement logout logic
  }

  filterNavItems(): void {
    if (!this.searchQuery.trim()) {
      this.serviceApiService.getNavbarData().subscribe(data => {
        this.navData = data;
        this.updateActiveState();
      });
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.navData = this.navData.map(group => {
      if (!group.items) return group;

      const filteredItems = group.items.filter(item =>
        item.label.toLowerCase().includes(query) ||
        (item.items && item.items.some(subItem =>
          subItem.label.toLowerCase().includes(query)
        ))
      );

      return {
        ...group,
        items: filteredItems,
        expanded: filteredItems.length > 0
      };
    });
  }
}
