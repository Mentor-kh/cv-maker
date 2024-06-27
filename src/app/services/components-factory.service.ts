import { Injectable, Type } from '@angular/core';
import { CardComponent } from '../components/components-factory/card/card.component';
import { ArticleComponent } from '../components/components-factory/article/article.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentsFactoryService {
  getAds() {
    return [
      {
        type: 'Type 1',
        component: CardComponent,
        context: { name: 'Dr. IQ', bio: 'Smart as they come' },
      },
      {
        type: 'Type 2',
        component: CardComponent,
        context: { name: 'Bombasto', bio: 'Brave as they come' },
      },
      {
        type: 'Type 3',
        component: ArticleComponent,
        context: {
          headline: 'Hiring for several positions',
          body: 'Submit your resume today!',
        },
      },
      {
        type: 'Type 4',
        component: ArticleComponent,
        context: {
          headline: 'Openings in all departments',
          body: 'Apply today',
        },
      },
    ] as { type: string, component: Type<any>, context: Record<string, unknown> }[];
  }
}
