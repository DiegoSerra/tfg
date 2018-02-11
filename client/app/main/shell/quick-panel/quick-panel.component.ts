import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'app-quick-panel',
    templateUrl  : './quick-panel.component.html',
    styleUrls    : ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppQuickPanelComponent implements OnInit
{
    date: Date;
    settings: any;

    constructor()
    {
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };

    }

    ngOnInit()
    {

    }

}
