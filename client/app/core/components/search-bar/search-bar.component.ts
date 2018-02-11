import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppConfigService } from '../../services/config.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector   : 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls  : ['./search-bar.component.scss']
})
export class AppSearchBarComponent implements OnInit
{
    collapsed: boolean;
    toolbarColor: string;
    @Output() onInput: EventEmitter<any> = new EventEmitter();
    onSettingsChanged: Subscription;

    constructor(
        private appConfig: AppConfigService
    )
    {
        this.collapsed = true;
        this.onSettingsChanged =
            this.appConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.toolbarColor = newSettings.colorClasses.toolbar;
                    }
                );
    }

    ngOnInit()
    {

    }

    collapse()
    {
        this.collapsed = true;
    }

    expand()
    {
        this.collapsed = false;
    }

    search(event)
    {
        const value = event.target.value;

        this.onInput.emit(value);
    }

}
