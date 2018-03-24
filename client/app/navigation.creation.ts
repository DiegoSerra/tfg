import {UserService} from './core/services/user.service';
import {Injectable} from '@angular/core';
import {BadgesService} from './core/services/badges.service';

@Injectable()
export class AppNavigationCreation {
  public items: any[] = [];

  constructor(private userService: UserService,
              private badgesService: BadgesService) {
    this.update();
  }

  update() {
    this.items = [];
    this.badgesService.badges$
      .subscribe(badges => {
        if (this.userService.isLoggedIn()) {

          if (this.userService.isSuperAdmin()) {
            this.items = [...this.items,
              {
                title: 'Administrador',
                type: 'nav-collapse',
                icon: 'font_download',
                'children': [
                  {
                    type: 'nav-item',
                    title: 'Usuarios',
                    url: '/app/admin/users'
                  },
                  {
                    type: 'nav-item',
                    title: 'Carreras',
                    url: '/app/admin/races'
                  }
                ]
              }
            ];
          }

          this.items = [...this.items,
            {
              title: 'Mis Carreras',
              type: 'nav-item',
              icon: 'directions_run',
              url: '/app/race/all',
            },
            {
              title: 'Nueva Carrera',
              type: 'nav-item',
              icon: 'add_box',
              url: '/app/race/create',
            },
            {
              title: 'Chat',
              type: 'nav-item',
              icon: 'chat',
              url: '/app/chat',
              badge: badges.chat
            },
            {
              title: 'Calendario',
              type: 'nav-item',
              icon: 'today',
              url: '/app/calendar',
            },
            {
              title: 'Mi Perfil',
              type: 'nav-item',
              icon: 'person',
              url: '/app/profile',
            }
          ];
        }
      });

  }

  updateAndGet() {
    this.update();
    return this.items;
  }
}
