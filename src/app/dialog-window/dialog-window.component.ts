import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Note } from '../_models';

@Component({
  selector: 'dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss'],
})
export class DialogWindowComponent implements OnInit {
  public nodeForm: FormGroup;
  public noteData: Note;
  public title = 'Сreate a new note';

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) data: Note,
  ) {
    if (data) {
      this.noteData = data;
      this.title = 'Edit note';
    }
  }

  ngOnInit() {
    this.nodeForm = this.formBuilder.group({
      id: [this.noteData ? this.noteData.id : this.uuidv4()],
      description: [this.noteData ? this.noteData.description : '', [Validators.required]],
      tags: [this.noteData ? this.noteData.tags : new Set()],
      deletedTag: [this.noteData ? this.noteData.tags : new Set()],
    });

    this.nodeForm.get('description').valueChanges.subscribe((value: string) => {
      let tags = value.match(/#[a-zA-Zа-яА-Я0-9|-]+/g) ? value.match(/#[a-zA-Zа-яА-Я0-9|-]+/g) : [];

      tags = tags.map(element => {
        return element.slice(1);
      });

      this.nodeForm.get('tags').setValue(new Set(tags));
    });
  }

  save(): void {
    if (this.noteData) {
      const deletedArray: string[] = (Array.from(this.nodeForm.get('deletedTag').value) as string[]).filter(
        (item: string) => !this.nodeForm.get('tags').value.has(item),
      );

      this.nodeForm.get('deletedTag').setValue(new Set(deletedArray));
    }

    this.dialogRef.close(this.nodeForm.value as Note);
  }

  private uuidv4(): string {
    return 'xxxyx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
