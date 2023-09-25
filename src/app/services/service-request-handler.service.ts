import { Injectable } from '@angular/core';
import {map, Observable, switchMap} from "rxjs";
import {FhirClientService} from "./fhir-client.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestHandlerService {
  private practitioner: any;
  private patient: any;
  private serverUrl: string;
  constructor(private fhirClient: FhirClientService,) { }

  // initPractitioner(): Observable<any>{
  //   const practitioner$ = this.fhirClient.getPractitioner().pipe(map(result => this.practitioner = result));
  //   // const patient$ = this.fhirClient.getPatient().pipe(map(result => this.patient = result));
  //   const serverUrl$ = this.fhirClient.serverUrl$.pipe(map(result => this.serverUrl = result));
  //
  //   return practitioner$.pipe(
  //     switchMap(result => serverUrl$),
  //     switchMap(result => practitioner$))
  // }

  initPatient(){
    const patient$ = this.fhirClient.getPatient().pipe(map(result => this.patient = result));
    const serverUrl$ = this.fhirClient.serverUrl$.pipe(map(result => this.serverUrl = result));

    return patient$.pipe(
      switchMap(result => serverUrl$),
      switchMap(result => patient$))
  }
}
