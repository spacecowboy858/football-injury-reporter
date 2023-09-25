import {Injectable} from "@angular/core";
import {Observable, map, skipWhile, switchMap} from "rxjs";
import {SimpleObservation} from "../domain/simple-observation";
import { FhirClientService } from "./fhir-client.service";
import { StudentCodeService } from "../student-code.service";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fhirClient$: Observable<any>;
  constructor(private fhirClientService: FhirClientService, private studentCode: StudentCodeService) {
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

}
