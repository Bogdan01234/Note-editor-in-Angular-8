import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatInputModule, MatSortModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { NoteCardComponent } from './note-card/note-card.component';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import { AngularWebStorageModule } from 'angular-web-storage';
import { AppService } from './services/app-service';

@NgModule({
  declarations: [AppComponent, DialogWindowComponent, NoteCardComponent],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    AngularWebStorageModule,
    MatDialogModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
  entryComponents: [DialogWindowComponent],
})
export class AppModule {}
