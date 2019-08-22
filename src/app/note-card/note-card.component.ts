import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { Note } from '../_models';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  public haveTags = false;

  @Input() noteData: Note;

  @Output() editNode: EventEmitter<Note> = new EventEmitter();
  @Output() deleteNode: EventEmitter<string> = new EventEmitter();
  @Output() searchByTag: EventEmitter<string> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    if ((this.noteData.tags as Set<string>).size) {
      this.haveTags = true;
    }
  }

  edit() {
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '600px',
      data: this.noteData,
    });

    dialogRef.afterClosed().subscribe((result: Note) => {
      if (result) {
        this.editNode.emit(result);
      }
    });
  }

  search(tag: string) {
    this.searchByTag.emit(tag);
    return false;
  }

  delete() {
    this.deleteNode.emit(this.noteData.id);
  }

  openDialog() {}
}
