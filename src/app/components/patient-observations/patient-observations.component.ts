import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from "rxjs";
import {SimpleObservation} from "../../domain/simple-observation";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-patient-observations',
  templateUrl: './patient-observations.component.html',
  styleUrls: ['./patient-observations.component.scss']
})

/**
 * This component utilizes a service to render data. This makes the component slightly more complicated in comparison
 * to the MedStatementsGridComponent component which is a "dumb" component used only to render data.
 * In Angular we use a combination of smart and dump components, depending on their function.
 * Child components (such as this one) are often used to render data, in which case it is preferred to make them "dumb"
 * and remove their reliance on services.
 * Also note that we use observables (bodyWeight$ and bodyHeight$) to render data on the screen. In this case we don't
 * subscribe to the observables and use $async pipe in the html.
 */
export class PatientObservationsComponent implements OnInit {

  @Input() patient: boolean = false;

  private readonly BODY_WEIGHT_LOINC_CODE = "29463-7";
  private readonly BODY_HEIGHT_LOINC_CODE = "8302-2";
  bodyWeight$: Observable<SimpleObservation>;
  bodyHeight$: Observable<SimpleObservation>;

  constructor(private apiService: ApiService){}

  ngOnInit() {
    this.bodyWeight$ = this.apiService.getLatestObservationByPatientIdAndLoincCode(this.BODY_WEIGHT_LOINC_CODE);
    this.bodyHeight$ = this.apiService.getLatestObservationByPatientIdAndLoincCode(this.BODY_HEIGHT_LOINC_CODE);
  }
}
