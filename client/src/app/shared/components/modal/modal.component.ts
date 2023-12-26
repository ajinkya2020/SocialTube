import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from "@angular/core";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: [],
})
export class AppModal implements OnChanges {
  @Input() displayModal: boolean = false;
  @Input() modalHeader: string = '';
  @Input() bodyTemplate!: TemplateRef<any>;
  @Input() footerTemplate!: TemplateRef<any>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.displayModal = changes['displayModal'].currentValue || this.displayModal;
  }
}