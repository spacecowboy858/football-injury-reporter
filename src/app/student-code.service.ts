import { Injectable } from '@angular/core';
import { Observable, from, of, map } from 'rxjs';


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
    return 'launch profile openid online_access patient/Patient.read patient/Observation.read patient/MedicationRequest.*';
  }

  exercise_1_searchMedicationRequests(client): Observable<any> {
    // return from<any[]>(client.patient.request('MedicationRequest', { flat:true})); 
    let queryParams = new URLSearchParams();
    queryParams.set('patient', client.patient.id);
    
    return from<any[]>(client.request('MedicationRequest?'+queryParams, { flat:true})); 
  }

  // http://docs.smarthealthit.org/client-js/client.html
  exercise_2_updateMedicationRequest(client, resource: any, status: string): Observable<any> {
    // Update the status field of the MedicationRequest resource
    // console.log(resource);
    resource.status = status;
    return from<any[]>(client.update(resource));
  }

  exercise_3_createMedicationRequest(client, medicationName: string): Observable<any> {
    // console.log(client);
    const patientId = client.patient.id;
    const patientReference = `Patient/${patientId}`;
    const newMedicationRequest = {
      resourceType: "MedicationRequest",
      status: "draft",
      intent: "order",
      subject: {
          reference: patientReference 
      },
      medicationCodeableConcept: {
          text: medicationName 
      }
    };
    return from<any[]>(client.create(newMedicationRequest));    
  }
}
