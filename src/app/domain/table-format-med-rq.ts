export class TableFormatMedRq {
  name: string;
  system: string;
  code: string;
  status: string;
  resource: any;

  constructor(medicationRequest: any){
    this.resource = medicationRequest;
    this.name = medicationRequest?.medicationCodeableConcept?.text ?? medicationRequest?.medicationCodeableConcept?.coding?.[0].display ?? '';
    this.system = medicationRequest?.medicationCodeableConcept?.coding?.[0]?.system ?? '';
    this.code = medicationRequest?.medicationCodeableConcept?.coding?.[0]?.code ?? '';
    this.status = medicationRequest?.status ?? '';
  }

}
