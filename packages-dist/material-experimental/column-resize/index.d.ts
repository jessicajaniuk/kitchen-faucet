import { CdkColumnDef } from '@angular/cdk/table';
import { CdkFlexTableResizeStrategy } from '@angular/cdk-experimental/column-resize';
import { CdkTable } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { _CoalescedStyleScheduler } from '@angular/cdk/table';
import { ColumnResize } from '@angular/cdk-experimental/column-resize';
import { ColumnResizeNotifier } from '@angular/cdk-experimental/column-resize';
import { ColumnResizeNotifierSource } from '@angular/cdk-experimental/column-resize';
import { Directionality } from '@angular/cdk/bidi';
import { ElementRef } from '@angular/core';
import { HeaderRowEventDispatcher } from '@angular/cdk-experimental/column-resize';
import * as i0 from '@angular/core';
import * as i5 from '@angular/material/core';
import * as i6 from '@angular/cdk/overlay';
import { Injector } from '@angular/core';
import { NgZone } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Provider } from '@angular/core';
import { Resizable } from '@angular/cdk-experimental/column-resize';
import { ResizeOverlayHandle } from '@angular/cdk-experimental/column-resize';
import { ResizeRef } from '@angular/cdk-experimental/column-resize';
import { ResizeStrategy } from '@angular/cdk-experimental/column-resize';
import { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER } from '@angular/cdk-experimental/column-resize';
import { Type } from '@angular/core';
import { ViewContainerRef } from '@angular/core';

declare abstract class AbstractMatColumnResize extends ColumnResize {
    getTableHeight(): number;
}

declare abstract class AbstractMatResizable extends Resizable<MatColumnResizeOverlayHandle> {
    minWidthPxInternal: number;
    protected getInlineHandleCssClassName(): string;
    protected getOverlayHandleComponentType(): Type<MatColumnResizeOverlayHandle>;
}

export declare const FLEX_RESIZE_STRATEGY_PROVIDER: Provider;

declare namespace i1 {
    export {
        MatColumnResizeOverlayHandle
    }
}

declare namespace i2 {
    export {
        MatDefaultEnabledColumnResize
    }
}

declare namespace i3 {
    export {
        MatDefaultEnabledColumnResizeFlex
    }
}

declare namespace i4 {
    export {
        MatDefaultResizable
    }
}

declare namespace i7 {
    export {
        MatColumnResize
    }
}

declare namespace i8 {
    export {
        MatColumnResizeFlex
    }
}

declare namespace i9 {
    export {
        MatResizable
    }
}

/**
 * Explicitly enables column resizing for a table-based mat-table.
 * Individual columns must be annotated specifically.
 */
export declare class MatColumnResize extends AbstractMatColumnResize {
    readonly columnResizeNotifier: ColumnResizeNotifier;
    readonly elementRef: ElementRef<HTMLElement>;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly ngZone: NgZone;
    protected readonly notifier: ColumnResizeNotifierSource;
    constructor(columnResizeNotifier: ColumnResizeNotifier, elementRef: ElementRef<HTMLElement>, eventDispatcher: HeaderRowEventDispatcher, ngZone: NgZone, notifier: ColumnResizeNotifierSource);
    static ??fac: i0.????FactoryDeclaration<MatColumnResize, never>;
    static ??dir: i0.????DirectiveDeclaration<MatColumnResize, "table[mat-table][columnResize]", never, {}, {}, never, never, false, never>;
}

export declare class MatColumnResizeCommonModule {
    static ??fac: i0.????FactoryDeclaration<MatColumnResizeCommonModule, never>;
    static ??mod: i0.????NgModuleDeclaration<MatColumnResizeCommonModule, [typeof i1.MatColumnResizeOverlayHandle], never, [typeof i1.MatColumnResizeOverlayHandle]>;
    static ??inj: i0.????InjectorDeclaration<MatColumnResizeCommonModule>;
}

/**
 * Explicitly enables column resizing for a flexbox-based mat-table.
 * Individual columns must be annotated specifically.
 */
export declare class MatColumnResizeFlex extends AbstractMatColumnResize {
    readonly columnResizeNotifier: ColumnResizeNotifier;
    readonly elementRef: ElementRef<HTMLElement>;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly ngZone: NgZone;
    protected readonly notifier: ColumnResizeNotifierSource;
    constructor(columnResizeNotifier: ColumnResizeNotifier, elementRef: ElementRef<HTMLElement>, eventDispatcher: HeaderRowEventDispatcher, ngZone: NgZone, notifier: ColumnResizeNotifierSource);
    static ??fac: i0.????FactoryDeclaration<MatColumnResizeFlex, never>;
    static ??dir: i0.????DirectiveDeclaration<MatColumnResizeFlex, "mat-table[columnResize]", never, {}, {}, never, never, false, never>;
}

export declare class MatColumnResizeModule {
    static ??fac: i0.????FactoryDeclaration<MatColumnResizeModule, never>;
    static ??mod: i0.????NgModuleDeclaration<MatColumnResizeModule, [typeof i7.MatColumnResize, typeof i8.MatColumnResizeFlex, typeof i9.MatResizable], [typeof i5.MatCommonModule, typeof i6.OverlayModule, typeof MatColumnResizeCommonModule], [typeof i7.MatColumnResize, typeof i8.MatColumnResizeFlex, typeof i9.MatResizable]>;
    static ??inj: i0.????InjectorDeclaration<MatColumnResizeModule>;
}

/**
 * Component shown over the edge of a resizable column that is responsible
 * for handling column resize mouse events and displaying a vertical line along the column edge.
 */
export declare class MatColumnResizeOverlayHandle extends ResizeOverlayHandle {
    protected readonly columnDef: CdkColumnDef;
    protected readonly columnResize: ColumnResize;
    protected readonly directionality: Directionality;
    protected readonly elementRef: ElementRef;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly ngZone: NgZone;
    protected readonly resizeNotifier: ColumnResizeNotifierSource;
    protected readonly resizeRef: ResizeRef;
    protected readonly styleScheduler: _CoalescedStyleScheduler;
    protected readonly document: Document;
    topElement: ElementRef<HTMLElement>;
    constructor(columnDef: CdkColumnDef, columnResize: ColumnResize, directionality: Directionality, elementRef: ElementRef, eventDispatcher: HeaderRowEventDispatcher, ngZone: NgZone, resizeNotifier: ColumnResizeNotifierSource, resizeRef: ResizeRef, styleScheduler: _CoalescedStyleScheduler, document: any);
    protected updateResizeActive(active: boolean): void;
    static ??fac: i0.????FactoryDeclaration<MatColumnResizeOverlayHandle, never>;
    static ??cmp: i0.????ComponentDeclaration<MatColumnResizeOverlayHandle, "ng-component", never, {}, {}, never, never, false, never>;
}

/**
 * Implicitly enables column resizing for a table-based mat-table.
 * Individual columns will be resizable unless opted out.
 */
export declare class MatDefaultEnabledColumnResize extends AbstractMatColumnResize {
    readonly columnResizeNotifier: ColumnResizeNotifier;
    readonly elementRef: ElementRef<HTMLElement>;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly ngZone: NgZone;
    protected readonly notifier: ColumnResizeNotifierSource;
    constructor(columnResizeNotifier: ColumnResizeNotifier, elementRef: ElementRef<HTMLElement>, eventDispatcher: HeaderRowEventDispatcher, ngZone: NgZone, notifier: ColumnResizeNotifierSource);
    static ??fac: i0.????FactoryDeclaration<MatDefaultEnabledColumnResize, never>;
    static ??dir: i0.????DirectiveDeclaration<MatDefaultEnabledColumnResize, "table[mat-table]", never, {}, {}, never, never, false, never>;
}

/**
 * Implicitly enables column resizing for a flexbox-based mat-table.
 * Individual columns will be resizable unless opted out.
 */
export declare class MatDefaultEnabledColumnResizeFlex extends AbstractMatColumnResize {
    readonly columnResizeNotifier: ColumnResizeNotifier;
    readonly elementRef: ElementRef<HTMLElement>;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly ngZone: NgZone;
    protected readonly notifier: ColumnResizeNotifierSource;
    constructor(columnResizeNotifier: ColumnResizeNotifier, elementRef: ElementRef<HTMLElement>, eventDispatcher: HeaderRowEventDispatcher, ngZone: NgZone, notifier: ColumnResizeNotifierSource);
    static ??fac: i0.????FactoryDeclaration<MatDefaultEnabledColumnResizeFlex, never>;
    static ??dir: i0.????DirectiveDeclaration<MatDefaultEnabledColumnResizeFlex, "mat-table", never, {}, {}, never, never, false, never>;
}

export declare class MatDefaultEnabledColumnResizeModule {
    static ??fac: i0.????FactoryDeclaration<MatDefaultEnabledColumnResizeModule, never>;
    static ??mod: i0.????NgModuleDeclaration<MatDefaultEnabledColumnResizeModule, [typeof i2.MatDefaultEnabledColumnResize, typeof i3.MatDefaultEnabledColumnResizeFlex, typeof i4.MatDefaultResizable], [typeof i5.MatCommonModule, typeof i6.OverlayModule, typeof MatColumnResizeCommonModule], [typeof i2.MatDefaultEnabledColumnResize, typeof i3.MatDefaultEnabledColumnResizeFlex, typeof i4.MatDefaultResizable]>;
    static ??inj: i0.????InjectorDeclaration<MatDefaultEnabledColumnResizeModule>;
}

/**
 * Implicitly enables column resizing for a mat-header-cell unless the disableResize attribute
 * is present.
 */
export declare class MatDefaultResizable extends AbstractMatResizable {
    protected readonly columnDef: CdkColumnDef;
    protected readonly columnResize: ColumnResize;
    protected readonly directionality: Directionality;
    protected readonly elementRef: ElementRef;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly injector: Injector;
    protected readonly ngZone: NgZone;
    protected readonly overlay: Overlay;
    protected readonly resizeNotifier: ColumnResizeNotifierSource;
    protected readonly resizeStrategy: ResizeStrategy;
    protected readonly styleScheduler: _CoalescedStyleScheduler;
    protected readonly viewContainerRef: ViewContainerRef;
    protected readonly changeDetectorRef: ChangeDetectorRef;
    protected readonly document: Document;
    constructor(columnDef: CdkColumnDef, columnResize: ColumnResize, directionality: Directionality, document: any, elementRef: ElementRef, eventDispatcher: HeaderRowEventDispatcher, injector: Injector, ngZone: NgZone, overlay: Overlay, resizeNotifier: ColumnResizeNotifierSource, resizeStrategy: ResizeStrategy, styleScheduler: _CoalescedStyleScheduler, viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef);
    static ??fac: i0.????FactoryDeclaration<MatDefaultResizable, never>;
    static ??dir: i0.????DirectiveDeclaration<MatDefaultResizable, "mat-header-cell:not([disableResize]), th[mat-header-cell]:not([disableResize])", never, { "minWidthPx": "matResizableMinWidthPx"; "maxWidthPx": "matResizableMaxWidthPx"; }, {}, never, never, false, never>;
}

/**
 * Overrides CdkFlexTableResizeStrategy to match mat-column elements.
 */
export declare class MatFlexTableResizeStrategy extends CdkFlexTableResizeStrategy {
    constructor(columnResize: ColumnResize, styleScheduler: _CoalescedStyleScheduler, table: CdkTable<unknown>, document: any);
    protected getColumnCssClass(cssFriendlyColumnName: string): string;
    static ??fac: i0.????FactoryDeclaration<MatFlexTableResizeStrategy, never>;
    static ??prov: i0.????InjectableDeclaration<MatFlexTableResizeStrategy>;
}

/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
export declare class MatResizable extends AbstractMatResizable {
    protected readonly columnDef: CdkColumnDef;
    protected readonly columnResize: ColumnResize;
    protected readonly directionality: Directionality;
    protected readonly elementRef: ElementRef;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly injector: Injector;
    protected readonly ngZone: NgZone;
    protected readonly overlay: Overlay;
    protected readonly resizeNotifier: ColumnResizeNotifierSource;
    protected readonly resizeStrategy: ResizeStrategy;
    protected readonly styleScheduler: _CoalescedStyleScheduler;
    protected readonly viewContainerRef: ViewContainerRef;
    protected readonly changeDetectorRef: ChangeDetectorRef;
    protected readonly document: Document;
    constructor(columnDef: CdkColumnDef, columnResize: ColumnResize, directionality: Directionality, document: any, elementRef: ElementRef, eventDispatcher: HeaderRowEventDispatcher, injector: Injector, ngZone: NgZone, overlay: Overlay, resizeNotifier: ColumnResizeNotifierSource, resizeStrategy: ResizeStrategy, styleScheduler: _CoalescedStyleScheduler, viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef);
    static ??fac: i0.????FactoryDeclaration<MatResizable, never>;
    static ??dir: i0.????DirectiveDeclaration<MatResizable, "mat-header-cell[resizable], th[mat-header-cell][resizable]", never, { "minWidthPx": "matResizableMinWidthPx"; "maxWidthPx": "matResizableMaxWidthPx"; }, {}, never, never, false, never>;
}

export { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER }

export { }
