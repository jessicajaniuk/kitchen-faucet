import {FocusMonitor} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule, ViewportRuler} from '@angular/cdk/scrolling';
import {CdkTableModule, DataSource} from '@angular/cdk/table';
import {Component, ElementRef, ErrorHandler, NgModule} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheet, MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCardModule} from '@angular/material/legacy-card';
import {MatLegacyCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyChipsModule} from '@angular/material/legacy-chips';
import {MatLegacyDialog, MatLegacyDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule} from '@angular/material/legacy-list';
import {MatLegacyMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatLegacyProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacyRadioModule} from '@angular/material/legacy-radio';
import {MatLegacySelectModule} from '@angular/material/legacy-select';
import {MatLegacySlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacySliderModule} from '@angular/material/legacy-slider';
import {MatLegacySnackBar, MatLegacySnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyTableModule} from '@angular/material/legacy-table';
import {MatLegacyTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyTooltipModule} from '@angular/material/legacy-tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Observable, of as observableOf} from 'rxjs';

export class TableDataSource extends DataSource<any> {
  connect(): Observable<any> {
    return observableOf([{userId: 1}, {userId: 2}]);
  }

  disconnect() {}
}

@Component({
  template: `<button>Do the thing</button>`,
})
export class TestEntryComponent {
}

@Component({
  selector: 'kitchen-faucet',
  templateUrl: './kitchen-faucet.html',
  styles: [
    `
    .universal-viewport {
      height: 100px;
      border: 1px solid black;
    }
  `,
  ],
})
export class KitchenFaucet {
  /** List of columns for the CDK and Material table. */
  tableColumns = ['userId'];

  /** Data source for the CDK and Material table. */
  tableDataSource = new TableDataSource();

  /** Data used to render a virtual scrolling list. */
  virtualScrollData = Array(10000).fill(50);

  constructor(
      snackBar: MatLegacySnackBar,
      dialog: MatLegacyDialog,
      viewportRuler: ViewportRuler,
      focusMonitor: FocusMonitor,
      elementRef: ElementRef<HTMLElement>,
      bottomSheet: MatBottomSheet,
  ) {
    focusMonitor.focusVia(elementRef, 'program');
    snackBar.open('Hello there');
    dialog.open(TestEntryComponent);
    bottomSheet.open(TestEntryComponent);

    // Do a sanity check on the viewport ruler.
    viewportRuler.getViewportRect();
    viewportRuler.getViewportSize();
    viewportRuler.getViewportScrollPosition();
  }
}

@NgModule({
  imports: [
    MatLegacyAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatLegacyButtonModule,
    MatButtonToggleModule,
    MatLegacyCardModule,
    MatLegacyCheckboxModule,
    MatLegacyChipsModule,
    MatDatepickerModule,
    MatLegacyDialogModule,
    MatDividerModule,
    MatLegacyFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatLegacyInputModule,
    MatLegacyListModule,
    MatLegacyMenuModule,
    MatNativeDateModule,
    MatLegacyPaginatorModule,
    MatLegacyProgressBarModule,
    MatLegacyProgressSpinnerModule,
    MatLegacyRadioModule,
    MatRippleModule,
    MatLegacySelectModule,
    MatSidenavModule,
    MatLegacySliderModule,
    MatLegacySlideToggleModule,
    MatLegacySnackBarModule,
    MatLegacyTabsModule,
    MatToolbarModule,
    MatLegacyTooltipModule,
    MatExpansionModule,
    MatSortModule,
    MatLegacyTableModule,
    MatStepperModule,
    ScrollingModule,

    // CDK Modules
    CdkTableModule,
    DragDropModule,
  ],
  declarations: [KitchenFaucet, TestEntryComponent],
  exports: [KitchenFaucet, TestEntryComponent],
  providers: [
    {
      // If an error is thrown asynchronously during server-side rendering it'll
      // get logged to stderr, but it won't cause the build to fail. We still
      // want to catch these errors so we provide an `ErrorHandler` that
      // re-throws the error and causes the process to exit correctly.
      provide: ErrorHandler,
      useValue: {handleError: ERROR_HANDLER},
    },
  ],
})
export class KitchenFaucetModule {
}

export function ERROR_HANDLER(error: Error) {
  throw error;
}
