import { Component } from '@angular/core';
import {FhirClientService} from "../../services/fhir-client.service";

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss']
})
export class LaunchComponent {

  constructor(private fhirClient: FhirClientService) { }
  ngOnInit(): void {
    this.fhirClient.authorize();
  }
}
