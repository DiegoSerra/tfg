import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
    selector   : 'app-nav-subheader',
    templateUrl: './nav-subheader.component.html',
    styleUrls  : ['./nav-subheader.component.scss']
})
export class AppNavSubheaderComponent implements OnInit
{
    @HostBinding('class') classes = 'nav-subheader';
    @Input() item: any;

    constructor()
    {
    }

    ngOnInit()
    {
    }

}
