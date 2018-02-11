import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appWidgetToggle]'
})
export class AppWidgetToggleDirective implements OnInit, AfterViewInit
{

    constructor(public el: ElementRef)
    {
    }

    ngOnInit()
    {
    }

    ngAfterViewInit()
    {
    }

}
