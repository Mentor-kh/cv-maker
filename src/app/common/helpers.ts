import { FormArray } from '@angular/forms';
import { Subject } from 'rxjs';

/**
 * Moves an item in a FormArray to another position.
 * @param formArray FormArray instance in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which he item should be moved.
 */

export function moveItemInFormArray(
  formArray: FormArray,
  fromIndex: number,
  toIndex: number
): void {
  const dir = toIndex > fromIndex ? 1 : -1;

  const item = formArray.at(fromIndex);
  for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
    const current = formArray.at(i + dir);
    formArray.setControl(i, current);
  }
  formArray.setControl(toIndex, item);
}

/**
 * @description Completes all subjects in case list is defined.
 * @param { Subject<any>[] } subjects
 */
// tslint:disable-next-line: no-any
export function subjectsComplete(subjects$: Subject<any>[]): void {
	// tslint:disable-next-line: no-any
	subjects$.forEach((subject: Subject<any>) => {
	  if (subject) {
		subject.complete();
	  }
	});
  }