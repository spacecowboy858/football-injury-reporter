export class PatientDemographics{
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  address: string;
  constructor(patientResource: any) {
    this.dob = patientResource.birthDate;
    this.firstName = patientResource?.name?.[0]?.given?.[0];
    this.lastName = patientResource?.name?.[0]?.family;
    this.gender = patientResource.gender;
    this.phoneNumber = patientResource?.telecom?.[0]?.value;
    this.address = `${patientResource?.address?.[0]?.line?.[0]},
                    ${patientResource?.address?.[0]?.city},
                    ${patientResource?.address?.[0]?.state}
                    ${patientResource?.address?.[0]?.postalCode}`;
  }
}
