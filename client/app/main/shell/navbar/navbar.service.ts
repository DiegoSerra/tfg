import { Injectable } from '@angular/core';

@Injectable()
export class AppNavbarService
{
    navBarRef;

    constructor()
    {
    }

    setNavBar(ref)
    {
        this.navBarRef = ref;
    }

    getNavBar()
    {
        return this.navBarRef;
    }
}
