import {Component, OnInit} from '@angular/core';
import {FhirClientService} from "../../services/fhir-client.service";
import {UtilsService} from "../../services/utils.service";
import {TableFormatMedRq} from "../../domain/table-format-med-rq";
import {ApiService} from "../../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { client } from 'fhirclient';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{
  isLoading: boolean = false;
  medicationStmntResponseBundle: any;
  medicationStatements: TableFormatMedRq[] = [];
  patient: any;
  orderMedicationForm: FormGroup;
  injuryForm: FormGroup;
  positionOptions: string[] = [];
  formationOptions: string[] = [];
  playCallOptions: string[] = [];

  constructor(
    private fhirClient: FhirClientService,
    private apiService: ApiService,
    private utilsService: UtilsService){
    this.fhirClient.readyClient();
  }


  ngOnInit(): void {
    this.isLoading = true;

    this.apiService.searchMedicationRequestByPatientId().subscribe({
      next: value => {
        this.isLoading = false;
        this.medicationStatements = this.toTableFormat(value);
      },    
      error: err => {
        this.isLoading = false;
        console.error(err);
        this.utilsService.showErrorNotification("Error loading records. Please check the browser console.")
      }
    });

    this.orderMedicationForm = new FormGroup({
      medicationName: new FormControl('', [Validators.required])
    });
    this.apiService.searchConditionsByPatientId().subscribe({
      next: value => {
        this.isLoading = false;
        console.log(value);
        // this.medicationStatements = this.toTableFormat(value);
      },    
      error: err => {
        this.isLoading = false;
        console.error(err);
        this.utilsService.showErrorNotification("Error loading conditions. Please check the browser console.")
      }
    });
    // Initialize injuryForm for football injury details
    this.injuryForm = new FormGroup({
      position: new FormControl('', [Validators.required]),
      formation: new FormControl('', [Validators.required]),
      playCall: new FormControl('', [Validators.required]),
      injury: new FormControl('', [Validators.required]),
      dateOfInjury: new FormControl('', [Validators.required])
    });
    // Fetch options dynamically from JSON files
    this.apiService.getPositionOptions().subscribe({
      next: data => {
        this.positionOptions = data.sort();
        // console.log('Position Options:', this.positionOptions);
      },
      error: err => {
        console.error('Error fetching position options:', err);
      }
    });
    this.apiService.getFormationOptions().subscribe({
      next: options => {
        this.formationOptions = options.sort();
        // console.log('Formation Options:', this.formationOptions);
      },
      error: err => {
        console.error('Error fetching formation options:', err);
      }
    });
    
    this.apiService.getPlayCallOptions().subscribe({
      next: options => {
        this.playCallOptions = options.sort();
        // console.log('Play Call Options:', this.playCallOptions);
      },
      error: err => {
        console.error('Error fetching play call options:', err);
      }
    });

  }
  private toTableFormat(medicationRequestList: any): TableFormatMedRq[] | null {
    let tableFormatMedicationStatementList: TableFormatMedRq[] = [];
    medicationRequestList.map(resource => {
       tableFormatMedicationStatementList.push(new TableFormatMedRq(resource));
      });
    return tableFormatMedicationStatementList;
  }

  onUpdateStatus($event: { status: string; resource: any }) {
    this.apiService.updateMedicationRequest($event.resource, $event.status).subscribe({
      next: value => {
        this.utilsService.showSuccessNotification("MedicationRequest updated successfully.");
        console.info("MedicationRequest updated successfully.")
        console.info(value);
      },
      error: err => {
        this.utilsService.showErrorNotification("Error updating MedicationRequest. See dev console for error.");
        console.error("Error updating MedicationRequest.")
        console.error(err);
      }
    });
  }

  onOrderMedication() {
    if(this.orderMedicationForm.invalid){
      console.warn("Invalid Order Medication form")
      return;
    }

    const medicationName = this.orderMedicationForm.controls['medicationName'].value;

    this.apiService.orderMedication(medicationName).subscribe({
      next: value => {
        this.utilsService.showSuccessNotification("MedicationRequest created successfully.")
        console.info("MedicationRequest created successfully.")
        console.info(value)
      },
      error: err => {
        this.utilsService.showErrorNotification("Error creating MedicationRequest. See dev console for error.");
        console.error("Error creating MedicationRequest.")
        console.error(err);
      }
    });
  }

  onSubmitInjuryData() {
    if (this.injuryForm.invalid) {
      console.warn("Invalid injury form");
      return;
    }

    const injuryData = {
      position: this.injuryForm.controls['position'].value,
      formation: this.injuryForm.controls['formation'].value,
      playCall: this.injuryForm.controls['playCall'].value,
      injury: this.injuryForm.controls['injury'].value,
      dateOfInjury: this.injuryForm.controls['dateOfInjury'].value
    };

    // Submit the injury data
    this.apiService.submitInjuryData(injuryData).subscribe({
      next: value => {
        console.log("Injury data submitted successfully") ;
        console.log(value);
      },
      error: err => {
        console.error("Error submitting injury data", err);
      }
    });
  }
}
