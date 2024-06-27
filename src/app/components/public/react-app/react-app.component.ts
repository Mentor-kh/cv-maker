import { AsyncPipe, CommonModule, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  client
} from '@gradio/client';
import { ComponentsFactoryModule } from '../../components-factory/components-factory.module';
import { ComponentsFactoryService } from 'src/app/services/components-factory.service';

@Component({
  selector: 'app-react-app',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgComponentOutlet,
    AsyncPipe,
    NgTemplateOutlet,
    ComponentsFactoryModule,
  ],
  templateUrl: './react-app.component.html',
  styleUrl: './react-app.component.scss'
})
export class ReactAppComponent implements OnInit {
  private currentAdIndex: number = 0;

  get components() {
    return this.service.getAds();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentComponent(): any {
    return this.components[this.currentAdIndex];
  }
  private apiUrl: string = 'assets/files/sample-1.wav';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public audioFileUrl!: string;
  private audioFileBlob!: Blob;
  public imageUrl?: string;
  public isSpinnerVisible: boolean = false;

  public constructor(private service: ComponentsFactoryService) {

  }

  public select: FormGroup = new FormGroup({
    componentSelect: new FormControl(this.components[this.currentAdIndex]),
  });

  public form: FormGroup = new FormGroup({
    desciption: new FormControl('', Validators.required),
  });

  public ngOnInit(): void {
    this.getAudioFile();
    this.callTranslate();
  }

  public onChange(event: any): void {
    console.log('onChange', this.select.controls['componentSelect'].value);
    this.currentAdIndex = this.select.controls['componentSelect'].value;
  }

  public submitForm(event: Event): void {
    console.log('submitForm', this.form.value);
    event.preventDefault();
    this.isSpinnerVisible = true;
    this.imageUrl = undefined;
    this.callPlayground(this.form.value.desciption);
  }

  private async getAudioFile(): Promise<void> {
    const response = await fetch(this.apiUrl);

    this.audioFileBlob = await response.blob();
    this.audioFileUrl = response.url;

    console.log(this.audioFileUrl, this.audioFileBlob);
  }

  public async callPlayground(value: string): Promise<void> {
    const app = await client('playgroundai/playground-v2.5', {});
    const app_info = await app.view_api();
    console.log('playgroundai/playground-v2.5:', app_info);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await app.predict('/run', [value, value, false, 0, 1536, 1536, 16, true]);
    console.log(result.data);
    if (result.data && result.data[0] && result.data[0][0] && result.data[0][0].image.path) {
      this.isSpinnerVisible = false;
      this.imageUrl = `https://playgroundai-playground-v2-5.hf.space/--replicas/99tjk/file=${result.data[0][0].image.path}`;
    }
  }

  public async callTranslate(): Promise<void> {
    const app = await client('abidlabs/en2fr', {});
    const app_info = await app.view_api();
    console.log('abidlabs/en2fr api:', app_info);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await app.predict('/predict', ['Hello world! How is life threeting you?']);
    console.log(result.data);
  }

  public async callRecognision(): Promise<void> {
    console.log('callApi start');

    const app = await client('openai/whisper', {
      // hf_token: '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'
      hf_token: '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'
    });
    const app_info = await app.view_api();
    console.log('openai/whisper:', app_info);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transcription: any = await app.predict('/predict', [this.audioFileBlob, 'transcribe']);

    console.log(transcription.data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log_result(payload?: any) {
    console.log(payload + ' log_result');

    if (payload.data) {
      const {
        data: [translation]
      } = payload;
      console.log(`The translated result is: ${translation}`);
    }
  }
}
