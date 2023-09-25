import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentCodeService {
  
  constructor() {}

  // This is given as an example of the client, do not modify it.
  example_searchObservations(client, loincCode): Observable<any> {
    let queryParams = new URLSearchParams();
    queryParams.set('patient', client.patient.id);
    queryParams.set('code', loincCode);
    queryParams.set('_sort', '-date');
    return from<any[]>(client.request("Observation?" + queryParams, {flat: true}))
  }

  exercise_0_testScopes(): string {
    // Add the additional two scopes here.
    return 'launch profile openid online_access patient/Patient.read';
  }

  exercise_1_searchMedicationRequests(client): Observable<any> {
    // STUDENT TODO: Write your code here.

    // The following line is a placeholder so the code compiles. Replace it with a return similar to the example.
    return of([]); // STUDENT TODO: Remove me.
  }

  // http://docs.smarthealthit.org/client-js/client.html
  exercise_2_updateMedicationRequest(client, resource: any, status: string): Observable<any> {
    return of({}); // STUDENT TODO: Remove me.
  }

  exercise_3_createMedicationRequest(client, medicationName: string): Observable<any> {
    return of({}); // STUDENT TODO: Remove me.
  }
}
