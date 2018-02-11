import { Directive, HostListener, Input } from '@angular/core';
import { AppNavbarService } from './navbar.service';
import { AppNavbarComponent } from './navbar.component';

@Directive({
    selector: '[appNavbar]'
})
export class AppNavbarToggleDirective
{
    @Input() appNavbar: string;
    navbar: AppNavbarComponent;

    constructor(private navbarService: AppNavbarService)
    {
    }

    @HostListener('click')
    onClick()
    {
        this.navbar = this.navbarService.getNavBar();

        if ( !this.navbar[this.appNavbar] )
        {
            return;
        }

        this.navbar[this.appNavbar]();
    }
}
