import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import { Note } from './_models';
import { AppService } from './services/app-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public startArray = new Map<string, Note>();
  public viewArray = new Map<string, Note>();

  public allTagArray = new Map<string, Set<string>>();
  public searchTagArray = new Set<string>();

  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public noteCtrl = new FormControl();
  public filteredNotes: Observable<string[]>;

  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  @HostListener('window:beforeunload') unloadHandler() {
    this.save();
  }

  constructor(private dialog: MatDialog, private appService: AppService) {
    this.filteredNotes = this.noteCtrl.valueChanges.pipe(
      startWith(null),
      map((node: string | null) =>
        node
          ? this.appService._filter(node, Array.from(this.allTagArray.keys()))
          : Array.from(this.allTagArray.keys()).slice(),
      ),
    );
  }

  ngOnInit() {
    if (this.appService.getNoteFromSessionStorage().size) {
      this.startArray = this.appService.getNoteFromSessionStorage();
      this.viewArray = this.startArray;
    }

    if (this.appService.getTagsFromSessionStorage().size) {
      this.allTagArray = this.appService.getTagsFromSessionStorage();
      this.noteCtrl.setValue(null);
    }
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: Note) => {
      if (result) {
        this.startArray.set(result.id, result);
        this.viewArray = this.startArray;
        this.searchTagArray = new Set();

        this.eddTags(result.tags as Set<string>, result.id);
      }
    });
  }

  private eddTags(tags: Set<string>, noteId: string): void {
    if (!!tags.size) {
      tags.forEach(element => {
        if (this.allTagArray.has(element)) {
          this.allTagArray.get(element).add(noteId);
        } else {
          this.allTagArray.set(element, new Set([noteId]));
        }
      });

      this.noteCtrl.setValue(null);
    }
  }

  public searchByTag(tag: string): void {
    this.searchTagArray = new Set([tag]);
    this.search();
  }

  public search(): void {
    if (this.searchTagArray.size > 0) {
      let array = Array.from(this.startArray);

      for (const i of this.searchTagArray) {
        if (array.length !== 0) {
          array = array.filter(id => (id[1].tags as Set<string>).has(i));
        } else {
          break;
        }
      }

      this.viewArray = new Map(array);
    } else {
      this.viewArray = this.startArray;
    }
  }

  public editNode(noteData: Note): void {
    this.deleteTag(noteData.deletedTag as Set<string>, noteData.id);

    this.eddTags(noteData.tags as Set<string>, noteData.id);

    this.startArray.set(noteData.id, noteData);
    this.viewArray = this.startArray;
    this.searchTagArray = new Set();
  }

  public deleteNode(nodeId: string): void {
    if ((this.startArray.get(nodeId).tags as Set<string>).size) {
      this.deleteTag(this.startArray.get(nodeId).tags as Set<string>, nodeId);
    }

    this.startArray.delete(nodeId);
    this.viewArray = this.startArray;
    this.searchTagArray = new Set();
  }

  private deleteTag(tags: Set<string>, nodeId: string): void {
    if (!!tags.size) {
      tags.forEach(element => {
        if (this.allTagArray.has(element)) {
          this.allTagArray.get(element).delete(nodeId);
          if (this.allTagArray.get(element).size === 0) {
            this.allTagArray.delete(element);
          }
        }
      });

      this.noteCtrl.setValue(null);
    }
  }

  public remove(fruit: string): void {
    if (this.searchTagArray.has(fruit)) {
      this.searchTagArray.delete(fruit);
      this.search();
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.searchTagArray.add(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.noteCtrl.setValue(null);
    this.search();
  }

  private save(): void {
    this.appService.setNoteToSessionStorage(this.startArray);

    this.appService.setTagsToSessionStorage(this.allTagArray);
  }
}
