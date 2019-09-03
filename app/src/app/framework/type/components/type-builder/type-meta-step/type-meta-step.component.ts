import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'cmdb-type-meta-step',
  templateUrl: './type-meta-step.component.html',
  styleUrls: ['./type-meta-step.component.scss']
})
export class TypeMetaStepComponent implements OnInit {

  public summariesForm: FormGroup;
  public summariesSections = [];
  public externalsForm: FormGroup;
  public externalLinks = [];
  public hrefInterpolCounter;

  @Input()
  set preData(data: any) {
    if (data !== undefined) {
      if (data.render_meta !== undefined) {
        this.summariesSections = data.render_meta.summary;
        if (this.summariesSections != null && this.summariesSections.length > 0) {
          this.summariesForm.disable();
        }
        this.externalLinks = data.render_meta.external;
      }
    }
  }

  constructor() {
    this.summariesForm = new FormGroup({
      name: new FormControl('summaries', [Validators.required, this.listNameValidator(this.summariesSections)]),
      label: new FormControl('Summaries', Validators.required),
      fields: new FormControl('', Validators.required)
    });

    this.externalsForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.listNameValidator(this.externalLinks)]),
      label: new FormControl('', Validators.required),
      icon: new FormControl(''),
      href: new FormControl('', [Validators.required]),
      fields: new FormControl('')
    });
  }

  public get external_name() {
    return this.externalsForm.get('name');
  }

  public get external_label() {
    return this.externalsForm.get('label');
  }

  @Input() fields: any[] = [];

  private static occurrences(s, subString): number {
    s += '';
    subString += '';
    if (subString.length <= 0) {
      return (s.length + 1);
    }

    let n = 0;
    let pos = 0;

    while (true) {
      pos = s.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += 1;
      } else {
        break;
      }
    }
    return n;
  }

  public listNameValidator(list: any[]) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const nameInList = list.find(el => el.name === control.value);
      return nameInList ? {nameAlreadyTaken: {value: control.value}} : null;
    };
  }

  public ngOnInit(): void {
    this.summariesForm.get('name').valueChanges.subscribe(val => {
      if (this.summariesForm.get('name').value !== null) {
        this.summariesForm.get('label').setValue(val.charAt(0).toUpperCase() + val.toString().slice(1));
        this.summariesForm.get('label').markAsDirty({onlySelf: true});
        this.summariesForm.get('label').markAsTouched({onlySelf: true});
      }
    });

    this.externalsForm.get('name').valueChanges.subscribe(val => {
      if (this.externalsForm.get('name').value !== null) {
        this.externalsForm.get('label').setValue(val.charAt(0).toUpperCase() + val.toString().slice(1));
        this.externalsForm.get('label').markAsDirty({onlySelf: true});
        this.externalsForm.get('label').markAsTouched({onlySelf: true});
      }
    });

    this.externalsForm.get('href').valueChanges.subscribe((href: string) => {
      this.hrefInterpolCounter = Array(TypeMetaStepComponent.occurrences(href, '{}')).fill(0).map((x, i) => i);
    });
  }

  public addSummary() {
    this.summariesSections = [];
    this.summariesForm.get('name').setValue('summaries');
    this.summariesForm.get('label').setValue('Summaries');
    this.summariesSections.push(this.summariesForm.value);
    this.summariesForm.disable();
    this.summariesForm.reset();
  }

  public editSummary(data) {
    const rawSummaryData = this.summariesSections[this.summariesSections.indexOf(data)];
    this.summariesForm.reset();
    this.deleteSummary(data);
    this.summariesForm.patchValue(rawSummaryData);
  }

  public deleteSummary(data) {
    const index: number = this.summariesSections.indexOf(data);
    if (index !== -1) {
      this.summariesSections.splice(index, 1);
    }
    this.summariesForm.get('name').clearValidators();
    this.summariesForm.get('name').setValidators(this.listNameValidator(this.summariesSections));
    this.summariesForm.enable();
  }

  public addExternal() {
    this.externalLinks.push(this.externalsForm.value);
    this.externalsForm.reset();
    this.externalsForm.get('icon').setValue('fas fa-external-link-alt');
  }

  public editExternal(data) {
    const rawExternalData = this.externalLinks[this.externalLinks.indexOf(data)];
    this.externalsForm.reset();
    this.deleteExternal(data);
    this.externalsForm.patchValue(rawExternalData);
  }

  public deleteExternal(data) {
    const index: number = this.externalLinks.indexOf(data);
    if (index !== -1) {
      this.externalLinks.splice(index, 1);
    }
    this.externalsForm.get('name').clearValidators();
    this.externalsForm.get('name').setValidators(this.listNameValidator(this.externalLinks));
  }

}
