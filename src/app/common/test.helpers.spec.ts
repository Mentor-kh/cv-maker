import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

// tslint:disable-next-line:typedef
export function getElemByQuerySelector<T>(
    fixture: ComponentFixture<T>,
    querySelector: string
 ): HTMLElement {
    return fixture.nativeElement.querySelector(querySelector);
 }
 // tslint:disable-next-line:typedef
 export function getElemById<T>(
    fixture: ComponentFixture<T>,
    id: string
 ): HTMLElement {
    return fixture.nativeElement.querySelector(`[data-test-id="${id}"]`);
 }
 // tslint:disable-next-line:typedef
 export function findElem<T>(
    componentFixture: ComponentFixture<T>,
    selector: string
 ) {
    return componentFixture.debugElement.query(
       By.css(`[data-test-id="${selector}"]`)
    ).nativeElement;
 }
 