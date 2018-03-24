import { sequence, trigger, stagger, animate, style, group, query, transition, keyframes, animateChild, state, animation, useAnimation } from '@angular/animations';

// const query = (s, a, o = {optional: true}) => q(s, a, o);

const customAnimation = animation([
    style({
        opacity  : '{{opacity}}',
        transform: 'scale({{scale}}) translate3d({{x}}, {{y}}, {{z}})'
    }),
    animate('{{duration}} {{delay}} cubic-bezier(0.0, 0.0, 0.2, 1)', style('*'))
], {
    params: {
        duration: '200ms',
        delay   : '0ms',
        opacity : '0',
        scale   : '1',
        x       : '0',
        y       : '0',
        z       : '0'
    }
});

export class Animations
{
    public static slideInOut = trigger('slideInOut', [
        state('0', style({
            height : '0px',
            display: 'none'
        })),
        state('1', style({
            height : '*',
            display: 'block'
        })),
        transition('1 => 0', animate('300ms ease-out')),
        transition('0 => 1', animate('300ms ease-in'))
    ]);

    public static slideInLeft = trigger('slideInLeft', [
        state('void', style({
            transform: 'translateX(-100%)',
            display  : 'none'
        })),
        state('*', style({
            transform: 'translateX(0)',
            display  : 'flex'
        })),
        transition('void => *', animate('300ms')),
        transition('* => void', animate('300ms'))
    ]);

    public static slideInRight = trigger('slideInRight', [
        state('void', style({
            transform: 'translateX(100%)',
            display  : 'none'
        })),
        state('*', style({
            transform: 'translateX(0)',
            display  : 'flex'
        })),
        transition('void => *', animate('300ms')),
        transition('* => void', animate('300ms'))
    ]);

    public static slideInTop = trigger('slideInTop', [
        state('void', style({
            transform: 'translateY(-100%)',
            display  : 'none'
        })),
        state('*', style({
            transform: 'translateY(0)',
            display  : 'flex'
        })),
        transition('void => *', animate('300ms')),
        transition('* => void', animate('300ms'))
    ]);

    public static slideInBottom = trigger('slideInBottom', [
        state('void',
            style({
                transform: 'translateY(100%)',
                display  : 'none'
            })),
        state('*', style({
            transform: 'translateY(0)',
            display  : 'flex'
        })),
        transition('void => *', animate('300ms')),
        transition('* => void', animate('300ms'))
    ]);

    public static slideToggle = trigger('slideToggle', [
        transition('* => void', [
            style({ height: '*', opacity: '1', transform: 'translateX(0)'}),
                sequence([
                    animate('.35s ease', style({ height: '*', opacity: '.2', transform: 'translateX(20px)'})),
                    animate('.1s ease', style({ height: '0', opacity: 0, transform: 'translateX(20px)'}))
                ])
            ]),
        transition('void => *', [
            style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
                sequence([
                    animate('.1s ease', style({ height: '*', opacity: '.2', transform: 'translateX(20px)'})),
                    animate('.35s ease', style({ height: '*', opacity: 1, transform: 'translateX(0)'}))
                ])
            ])
    ]);

    public static routerTransitionLeft = trigger('routerTransitionLeft', [

        transition('* => *', [
            query('app-content > :enter, app-content > :leave', [
                style({
                    position: 'absolute',
                    top     : 0,
                    bottom  : 0,
                    left    : 0,
                    right   : 0
                })
            ], {optional: true}),
            query('app-content > :enter', [
                style({
                    transform: 'translateX(100%)',
                    opacity  : 0
                })
            ], {optional: true}),
            sequence([
                group([
                    query('app-content > :leave', [
                        style({
                            transform: 'translateX(0)',
                            opacity  : 1
                        }),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateX(-100%)',
                                opacity  : 0
                            }))
                    ], {optional: true}),
                    query('app-content > :enter', [
                        style({transform: 'translateX(100%)'}),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateX(0%)',
                                opacity  : 1
                            }))
                    ], {optional: true})
                ]),
                query('app-content > :leave', animateChild(), {optional: true}),
                query('app-content > :enter', animateChild(), {optional: true})
            ])
        ])
    ]);

    public static routerTransitionRight = trigger('routerTransitionRight', [

        transition('* => *', [
            query('app-content > :enter, app-content > :leave', [
                style({
                    position: 'absolute',
                    top     : 0,
                    bottom  : 0,
                    left    : 0,
                    right   : 0
                })
            ], {optional: true}),
            query('app-content > :enter', [
                style({
                    transform: 'translateX(-100%)',
                    opacity  : 0
                })
            ], {optional: true}),
            sequence([
                group([
                    query('app-content > :leave', [
                        style({
                            transform: 'translateX(0)',
                            opacity  : 1
                        }),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateX(100%)',
                                opacity  : 0
                            }))
                    ], {optional: true}),
                    query('app-content > :enter', [
                        style({transform: 'translateX(-100%)'}),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateX(0%)',
                                opacity  : 1
                            }))
                    ], {optional: true})
                ]),
                query('app-content > :leave', animateChild(), {optional: true}),
                query('app-content > :enter', animateChild(), {optional: true})
            ])
        ])
    ]);

    public static routerTransitionUp = trigger('routerTransitionUp', [

        transition('* => *', [
            query('app-content > :enter, app-content > :leave', [
                style({
                    position: 'absolute',
                    top     : 0,
                    bottom  : 0,
                    left    : 0,
                    right   : 0
                })
            ], {optional: true}),
            query('app-content > :enter', [
                style({
                    transform: 'translateY(100%)',
                    opacity  : 0
                })
            ], {optional: true}),
            sequence([
                group([
                    query('app-content > :leave', [
                        style({
                            transform: 'translateY(0)',
                            opacity  : 1
                        }),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateY(-100%)',
                                opacity  : 0
                            }))
                    ], {optional: true}),
                    query('app-content > :enter', [
                        style({transform: 'translateY(100%)'}),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateY(0%)',
                                opacity  : 1
                            }))
                    ], {optional: true})
                ]),
                query('app-content > :leave', animateChild(), {optional: true}),
                query('app-content > :enter', animateChild(), {optional: true})
            ])
        ])
    ]);

    public static routerTransitionDown = trigger('routerTransitionDown', [

        transition('* => *', [
            query('app-content > :enter, app-content > :leave', [
                style({
                    position: 'absolute',
                    top     : 0,
                    bottom  : 0,
                    left    : 0,
                    right   : 0
                })
            ], {optional: true}),
            query('app-content > :enter', [
                style({
                    transform: 'translateY(-100%)',
                    opacity  : 0
                })
            ], {optional: true}),
            sequence([
                group([
                    query('app-content > :leave', [
                        style({
                            transform: 'translateY(0)',
                            opacity  : 1
                        }),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateY(100%)',
                                opacity  : 0
                            }))
                    ], {optional: true}),
                    query('app-content > :enter', [
                        style({transform: 'translateY(-100%)'}),
                        animate('400ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                            style({
                                transform: 'translateY(0%)',
                                opacity  : 1
                            }))
                    ], {optional: true})
                ]),
                query('app-content > :leave', animateChild(), {optional: true}),
                query('app-content > :enter', animateChild(), {optional: true})
            ])
        ])
    ]);

    public static routerTransitionFade = trigger('routerTransitionFade', [

        transition('* => *', [

            query('app-content > :enter, app-content > :leave ', [
                style({
                    position: 'absolute',
                    top     : 0,
                    bottom  : 0,
                    left    : 0,
                    right   : 0
                })
            ], {optional: true}),
            query('app-content > :enter', [
                style({
                    opacity: 0
                })
            ], {optional: true}),
            // sequence([
                query('app-content > :leave', [
                    style({
                        opacity: 1
                    }),
                    animate('300ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                        style({
                            opacity: 0
                        }))
                ], {optional: true}),
                query('app-content > :enter', [
                    style({
                        opacity: 0
                    }),
                    animate('300ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                        style({
                            opacity: 1
                        }))
                ], {optional: true}),
            // ]),
            query('app-content > :enter', animateChild(), {optional: true}),
            query('app-content > :leave', animateChild(), {optional: true})
        ])
    ]);

    public static animate = trigger('animate', [transition('void => *', [useAnimation(customAnimation)])]);

    public static animateStagger = trigger('animateStagger', [
        state('50', style('*')),
        state('100', style('*')),
        state('200', style('*')),

        transition('void => 50',
            query('@*',
                [
                    stagger('50ms', [
                        animateChild()
                    ])
                ], {optional: true})),
        transition('void => 100',
            query('@*',
                [
                    stagger('100ms', [
                        animateChild()
                    ])
                ], {optional: true})),
        transition('void => 200',
            query('@*',
                [
                    stagger('200ms', [
                        animateChild()
                    ])
                ], {optional: true}))
    ]);
}
