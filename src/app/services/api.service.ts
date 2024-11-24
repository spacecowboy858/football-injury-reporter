import {Injectable} from "@angular/core";
import {Observable, map, skipWhile, switchMap, catchError, of, from} from "rxjs";
import {SimpleObservation} from "../domain/simple-observation";
import { FhirClientService } from "./fhir-client.service";
import { StudentCodeService } from "../student-code.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fhirClient$: Observable<any>;
  private apiUrl = 'https://hapi.fhir.org/baseR4';  // Adjust with your FHIR server URL

  constructor(
    private http: HttpClient,
    private fhirClientService: FhirClientService, 
    private studentCode: StudentCodeService
  ) {
    this.fhirClient$ = this.fhirClientService.getClient();
  }

  getLatestObservationByPatientIdAndLoincCode(loincCode: string): Observable<SimpleObservation | undefined> {
    return this.fhirClient$.pipe(skipWhile((client) => !client)).pipe(
      switchMap(client => {
        return this.studentCode.example_searchObservations(client, loincCode).pipe(
          map(
            (resultList: any[]) => {
              if (resultList.length > 0) {
                return new SimpleObservation(resultList[0]);
              }
              else { return undefined}
            }
          )
        );
      })
    );
  }

  searchMedicationRequestByPatientId(): Observable<any> {
    return this.fhirClient$.pipe(skipWhile((client) => !client)).pipe(
      switchMap(client => {
        return this.studentCode.exercise_1_searchMedicationRequests(client);
      })
    );
  }

  updateMedicationRequest(resource: any, status: string):  Observable<any> {
    return this.fhirClient$.pipe(skipWhile((client) => !client)).pipe(
      switchMap(client => {
         return this.studentCode.exercise_2_updateMedicationRequest(client, resource, status);
      })
    );
  }

  orderMedication(medicationName: string):  Observable<any> {
    return this.fhirClient$.pipe(skipWhile((client) => !client)).pipe(
      switchMap(client => {
        return this.studentCode.exercise_3_createMedicationRequest(client, medicationName);
      })
    );
  }

  searchConditionsByPatientId(): Observable<any> {
    return this.fhirClient$.pipe(skipWhile((client) => !client),
      switchMap(client => {
        // Create query parameters
        let queryParams = new URLSearchParams();
        console.log('client.patient.id: ' + client.patient.id);
        queryParams.set('patient', client.patient.id);  // Use the patient ID to search for conditions
  
        // Make the request to fetch conditions
        return from<any[]>(client.request('Condition?' + queryParams, { flat: true }));
      })
    );
  }

  submitInjuryData(injuryData: any):  Observable<any> {
    return this.fhirClient$.pipe(skipWhile((client) => !client)).pipe(
      switchMap(client => {
        // console.log(injuryData);
        const patientId = client.patient.id;
        const patientReference = `Patient/${patientId}`;
        const newConditionRequest = {
          resourceType: "Condition",
          clinicalStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active"
              }
            ]
          },
          verificationStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                code: "confirmed"
              }
            ]
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "unknown", // Placeholder if you don't have specific codes
                display: injuryData.injury || "Football injury"
              }
            ],
            text: injuryData.injury || "Football injury"
          },
          subject: {
            reference: patientReference // Assuming patientReference is defined elsewhere
          },
          encounter: {
            reference: "Encounter/placeholder" // Replace with a real encounter reference if available
          },
          onsetDateTime: injuryData.dateOfInjury || new Date().toISOString(),
          recordedDate: new Date().toISOString(),
          extension: [
            {
              url: "https://example.org/fhir/StructureDefinition/football-injury-extension",
              extension: [
                {
                  url: "position",
                  valueString: injuryData.position || "unknown"
                },
                {
                  url: "formation",
                  valueString: injuryData.formation || "unknown"
                },
                {
                  url: "playCall",
                  valueString: injuryData.playCall || "unknown"
                }
              ]
            }
          ]
        };
        
        return from<any[]>(client.create(newConditionRequest));  
      })
    );
  }

  getPositionOptions(): Observable<string[]> {
    const apiUrl = 'https://api.github.com/repos/spacecowboy858/football-fhir-extensions/contents/position-codes.json?ref=main';
  
    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        // Decode the Base64 content to a JSON string
        const decodedContent = atob(response.content);
        const json = JSON.parse(decodedContent); // Parse the JSON string
  
        // console.log('Decoded JSON:', json); // Log to inspect the structure of the response
  
        // Check the structure of the response to see where the 'concept' field is
        if (json && json.concept) {
          return json.concept.map((item: any) => item.display); // Map to 'display' field inside 'concept'
        } else {
          console.error('Invalid structure: "concept" field is missing or incorrectly named');
          return []; // Return an empty array if 'concept' is missing or named differently
        }
      }),
      catchError(err => {
        console.error("Error fetching position options:", err);
        return of([]); // Return an empty array on error
      })
    );
  }

// Fetch formation options from JSON (Formation Codes)
getFormationOptions(): Observable<string[]> {
  const apiUrl = 'https://api.github.com/repos/spacecowboy858/football-fhir-extensions/contents/formation-codes.json?ref=main';
  
  return this.http.get<any>(apiUrl).pipe(
    map(response => {
      // Decode the Base64 content to a JSON string
      const decodedContent = atob(response.content);
      const json = JSON.parse(decodedContent); // Parse the JSON string

      // console.log('Decoded formation structure:', json); // Log the entire decoded structure to inspect

      // Check the structure of the response to see where the 'concept' field is
      if (json && json.concept) {
        return json.concept.map((item: any) => item.display); // Map to 'display' field inside 'concept'
      } else {
        console.error('Invalid structure: "concept" field is missing or incorrectly named');
        return []; // Return an empty array if 'concept' is missing or named differently
      }
    }),
    catchError(err => {
      console.error("Error fetching formation options:", err);
      return of([]); // Return an empty array on error
    })
  );
}

// Fetch play call options from JSON (Play Call Codes)
getPlayCallOptions(): Observable<string[]> {
  const apiUrl = 'https://api.github.com/repos/spacecowboy858/football-fhir-extensions/contents/playcall-codes.json?ref=main';
  
  return this.http.get<any>(apiUrl).pipe(
    map(response => {
      // Decode the Base64 content to a JSON string
      const decodedContent = atob(response.content);
      const json = JSON.parse(decodedContent); // Parse the JSON string

      // console.log('Decoded play call structure:', json); // Log the entire decoded structure to inspect

      // Check the structure of the response to see where the 'concept' field is
      if (json && json.concept) {
        return json.concept.map((item: any) => item.display); // Map to 'display' field inside 'concept'
      } else {
        console.error('Invalid structure: "concept" field is missing or incorrectly named');
        return []; // Return an empty array if 'concept' is missing or named differently
      }
    }),
    catchError(err => {
      console.error("Error fetching play call options:", err);
      return of([]); // Return an empty array on error
    })
  );
}


}
