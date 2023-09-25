import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {TableFormatMedRq} from "../../domain/table-format-med-rq";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-med-rq-grid',
  templateUrl: './med-rq-grid.component.html',
  styleUrls: []
})
export class MedRqGridComponent implements OnChanges, AfterViewInit{

  @Input() data: TableFormatMedRq[];
  @Output() onUpdateStatus = new EventEmitter<{ status: string, resource: any}>();
  @ViewChild(MatSort) sort: MatSort;
  selectedRecord: TableFormatMedRq;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource: MatTableDataSource<TableFormatMedRq> = new MatTableDataSource<TableFormatMedRq>([]);
  displayedColumns: string[] = ['name', 'code', 'system', 'status'];
  availableStatusList: string[] = ['active', 'on-hold' , 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown'];

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data']?.currentValue && changes['data']?.currentValue?.length>0){
      this.dataSource.data = changes['data']?.currentValue;
    }
  }

  onSelectionChange(event: MatSelectChange, resource: any) {
    this.onUpdateStatus.emit({status: event.value, resource: resource});
  }
}
