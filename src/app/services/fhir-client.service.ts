import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable, skipWhile, switchMap} from "rxjs";
import { oauth2 as SmartClient } from 'fhirclient';
import {environment} from "../environments/environment";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class FhirClientService {
  private fhirClient: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private serverUrl: BehaviorSubject<string | null> = new BehaviorSubject<string| null>(null);
  public serverUrl$ = this.serverUrl.asObservable();
  constructor(private utilsService: UtilsService) { }

  authorize() {
    console.log("AUTHORIZING");
    SmartClient.authorize(
      {
        clientId: environment.clientId,
        scope: environment.fhirScope,
        redirectUri: environment.redirectUri
      }
    );
  }

  readyClient() {
    SmartClient.ready()
      .then((client: any) => {
        this.fhirClient.next(client);
        this.serverUrl.next(client.getState("serverUrl"));
      })
      .catch((error: any) => {
        this.utilsService.showErrorNotification("Error getting the client ready");
        console.error(error);
      })
  }

  public getClient(): Observable<any> {
    return this.fhirClient.pipe(
      skipWhile((client) => client === null),
      switchMap(() => {
        return this.fhirClient.asObservable();
      })
    )
  }

  public getPatient(): Observable<any> {
    return this.getClient().pipe(switchMap(
      (client) => {return from (client.patient.read())}
    ))
  }
}
