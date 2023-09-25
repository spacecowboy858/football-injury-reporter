import {Component, OnInit} from '@angular/core';
import {ServiceRequestHandlerService} from "../../services/service-request-handler.service";
import {PatientDemographics} from "../../domain/patient-demographics";

@Component({
  selector: 'app-patient-demographics',
  templateUrl: './patient-demographics.component.html',
  styleUrls: ['./patient-demographics.component.scss']
})
export class PatientDemographicsComponent implements OnInit{
  patientDemographics: PatientDemographics;
  constructor(private serviceRequestHandlerService: ServiceRequestHandlerService) {
  }
  ngOnInit(): void {
    this.serviceRequestHandlerService.initPatient().subscribe({
      next: patientResource => {
        this.patientDemographics = new PatientDemographics(patientResource);
      }
    });
  }

}
