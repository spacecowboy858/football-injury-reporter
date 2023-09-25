export class SimpleObservation {
  date: Date;
  name: string;
  value: string;
  unit: string;
  constructor(resourceEntry){
    this.date = resourceEntry?.effectiveDateTime;
    this.name = resourceEntry?.code?.text || resourceEntry?.code?.coding?.[0].display;
    this.value = resourceEntry?.valueQuantity?.value;
    this.unit = resourceEntry?.valueQuantity?.unit;
  }
}
