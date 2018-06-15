import { Component, ElementRef, HostBinding, OnDestroy, OnInit, Renderer2, ViewEncapsulation, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfigService } from '../core/services/config.service';
import { ChatSocketio } from './content/chat/chat.socketio';

@Component({
    selector     : 'app-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppMainComponent implements OnInit, OnDestroy
{
    onSettingsChanged: Subscription;
    appSettings: any;
    @HostBinding('class.disable-perfect-scrollbar') disableCustomScrollbars;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private appConfig: AppConfigService,
        private chatSocketio: ChatSocketio
    )
    {
        this.onSettingsChanged =
            this.appConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.appSettings = newSettings;
                        this.disableCustomScrollbars = !this.appSettings.customScrollbars;
                    }
                );

    }

    ngOnInit()
    {
        this.chatSocketio.connect();
    }

    ngOnDestroy()
    {
        this.onSettingsChanged.unsubscribe();
        this.chatSocketio.disconnect();     
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
