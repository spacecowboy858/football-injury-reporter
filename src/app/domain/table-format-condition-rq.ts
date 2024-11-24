export class TableFormatConditionRq {
  name: string;
  resource: any;
  position: string;
  formation: string;
  playCall: string;
  recordedDate: string;

  constructor(conditionRequest: any){
    this.resource = conditionRequest;
    this.name = conditionRequest?.code?.text ?? '';

    // Default values for position, formation, and playCall
    this.position = '';
    this.formation = '';
    this.playCall = '';

    // Parse the extension for position, formation, and playCall
    const injuryExtension = conditionRequest?.extension?.find(
      (ext: any) =>
        ext.url ===
        "https://example.org/fhir/StructureDefinition/football-injury-extension"
    );

    if (injuryExtension?.extension) {
      this.position =
        injuryExtension.extension.find((ext: any) => ext.url === 'position')
          ?.valueString ?? '';
      this.formation =
        injuryExtension.extension.find((ext: any) => ext.url === 'formation')
          ?.valueString ?? '';
      this.playCall =
        injuryExtension.extension.find((ext: any) => ext.url === 'playCall')
          ?.valueString ?? '';
    }
    this.recordedDate = conditionRequest?.recordedDate ?? '';
  }
}
