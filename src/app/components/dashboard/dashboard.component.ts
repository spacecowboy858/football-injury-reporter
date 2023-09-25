import {Component, OnInit} from '@angular/core';
import {FhirClientService} from "../../services/fhir-client.service";
import {UtilsService} from "../../services/utils.service";
import {TableFormatMedRq} from "../../domain/table-format-med-rq";
import {ApiService} from "../../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
}
