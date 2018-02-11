import { AfterContentInit, Component, ContentChildren, ElementRef, HostBinding, OnInit, QueryList, Renderer2, ViewEncapsulation } from '@angular/core';
import { AppWidgetToggleDirective } from './widget-toggle.directive';

@Component({
    selector     : 'app-widget',
    templateUrl  : './widget.component.html',
    styleUrls    : ['./widget.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AppWidgetComponent implements OnInit, AfterContentInit
{
    @HostBinding('class.flipped') flipped = false;
    @ContentChildren(AppWidgetToggleDirective, {descendants: true}) toggleButtons: QueryList<AppWidgetToggleDirective>;

    constructor(private el: ElementRef, private renderer: Renderer2)
    {
    }

    ngOnInit()
    {

    }

    ngAfterContentInit()
    {
        setTimeout(() => {

            this.toggleButtons.forEach(flipButton => {
                this.renderer.listen(flipButton.el.nativeElement, 'click', () => {
                    this.toggle();
                });
            });
        });
    }

    toggle()
    {
        this.flipped = !this.flipped;
    }

}
