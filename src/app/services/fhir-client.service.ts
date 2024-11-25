import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, skipWhile, switchMap } from 'rxjs';
import { oauth2 as SmartClient } from 'fhirclient';
import { environment } from '../environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FhirClientService {
  private fhirClient: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private serverUrl: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public serverUrl$ = this.serverUrl.asObservable();

  constructor(private utilsService: UtilsService) {}

  // Handle authorization and wait for response
  authorize() {
    console.log('AUTHORIZING');
    SmartClient.authorize({
      clientId: environment.clientId,
      scope: environment.fhirScope,
      redirectUri: environment.redirectUri,
      iss: 'https://launch.smarthealthit.org/v/r4/fhir',
    })
      .then(() => {
        console.log('Authorization successful, proceeding to readyClient.');
        this.readyClient(); // Call readyClient after authorization
      })
      .catch((error: any) => {
        console.error('Authorization failed:', error);
        this.utilsService.showErrorNotification('Authorization failed. Please try again.');
      });
  }

  // Initialize SMART client and handle state
  readyClient() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:', urlParams.toString());

    SmartClient.ready()
      .then((client: any) => {
        console.log('SMART client initialized:', client);
        this.fhirClient.next(client); // Update client state
        this.serverUrl.next(client.getState('serverUrl')); // Update server URL
      })
      .catch((error: any) => {
        console.error('Error in SmartClient.ready():', error);
        if (error.message.includes('No state found')) {
          console.warn('No state found. Initiating SMART authorization.');
          this.authorize(); // Relaunch the SMART flow if no state is found
        } else {
          this.utilsService.showErrorNotification('Error getting the client ready');
        }
      });
  }

  // Return the current client
  public getClient(): Observable<any> {
    return this.fhirClient.pipe(
      skipWhile((client) => client === null),
      switchMap(() => {
        return this.fhirClient.asObservable();
      })
    );
  }

  // Get patient data using the SMART client
  public getPatient(): Observable<any> {
    return this.getClient().pipe(
      switchMap((client) => {
        return from(client.patient.read());
      })
    );
  }
}