import { Component, ViewEncapsulation } from '@angular/core';
import { AppNavigationService } from './navigation.service';

@Component({
    selector     : 'app-navigation',
    templateUrl  : './navigation.component.html',
    styleUrls    : ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppNavigationComponent
{
    navigation: any[];

    constructor(private navigationService: AppNavigationService)
    {
        this.navigation = navigationService.getNavigation();
    }

}
