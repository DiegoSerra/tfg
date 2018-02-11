import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import { AppConfigService } from '../../services/config.service';

@Component({
    selector   : 'app-theme-options',
    templateUrl: './theme-options.component.html',
    styleUrls  : ['./theme-options.component.scss']
})
export class AppThemeOptionsComponent implements OnInit, OnDestroy
{
    @ViewChild('openButton') openButton;
    @ViewChild('panel') panel;

    public player: AnimationPlayer;
    appSettings: any;

    onSettingsChanged: Subscription;

    constructor(
        private animationBuilder: AnimationBuilder,
        private appConfig: AppConfigService
    )
    {
        this.onSettingsChanged =
            this.appConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.appSettings = newSettings;
                    }
                );
    }

    ngOnInit()
    {
    }

    onSettingsChange()
    {
        this.appConfig.setSettings(this.appSettings);
    }

    closeBar()
    {
        this.player =
            this.animationBuilder
                .build([
                    style({transform: 'translate3d(0,0,0)'}),
                    animate('400ms ease', style({transform: 'translate3d(100%,0,0)'}))
                ]).create(this.panel.nativeElement);
        this.player.play();
    }

    openBar()
    {
        this.player =
            this.animationBuilder
                .build([
                    style({transform: 'translate3d(100%,0,0)'}),
                    animate('400ms ease', style({transform: 'translate3d(0,0,0)'}))
                ]).create(this.panel.nativeElement);
        this.player.play();
    }

    ngOnDestroy()
    {
        this.onSettingsChanged.unsubscribe();
    }
}
