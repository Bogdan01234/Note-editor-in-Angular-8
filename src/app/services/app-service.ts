import { Injectable } from '@angular/core';
import { Note } from '../_models';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class AppService {
  constructor(public session: SessionStorageService) {}

  public _filter(value: string, allTagArray: string[]): string[] {
    const filterValue = value.toLowerCase();

    return allTagArray.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  }

  public setNoteToSessionStorage(startArray: Map<string, Note>): void {
    const startMapToArray: Array<[string, Note]> = [];

    Array.from(startArray).forEach(item => {
      item[1] = { ...item[1], tags: Array.from(item[1].tags), deletedTag: [] };
      startMapToArray.push(item);
    });

    this.session.set('startArray', startMapToArray);
  }

  public setTagsToSessionStorage(allTagArray: Map<string, Set<string>>): void {
    const allTagMapToArray: Array<[string, Set<string>]> = [];

    Array.from(allTagArray).forEach((item: any) => {
      item[1] = Array.from(item[1]);
      allTagMapToArray.push(item);
    });

    this.session.set('allTagArray', allTagMapToArray);
  }

  public getNoteFromSessionStorage(): Map<string, Note> {
    const arrayNote = this.session.get('startArray');
    const startMapToArray: Array<[string, Note]> = [];

    if (!!arrayNote) {
      arrayNote.forEach(item => {
        item[1] = { ...item[1], tags: new Set(item[1].tags), deletedTag: new Set() };
        startMapToArray.push(item);
      });
    }

    return new Map(startMapToArray);
  }

  public getTagsFromSessionStorage(): Map<string, Set<string>> {
    const arrayTags = this.session.get('allTagArray');
    const allTagMapToArray: Array<[string, Set<string>]> = [];

    if (!!arrayTags) {
      arrayTags.forEach(item => {
        item[1] = new Set(item[1]);
        allTagMapToArray.push(item);
      });
    }

    return new Map(allTagMapToArray);
  }
}
