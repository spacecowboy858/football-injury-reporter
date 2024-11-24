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
import {TableFormatConditionRq} from "../../domain/table-format-condition-rq";
import {MatSelectChange} from "@angular/material/select";


@Component({
  selector: 'app-condition-rq-grid',
  templateUrl: './condition-rq-grid.component.html',
  styleUrls: ['./condition-rq-grid.component.scss']
})
export class ConditionRqGridComponent implements OnChanges, AfterViewInit{
  @Input() data: TableFormatConditionRq[];
  @Output() onUpdateStatus = new EventEmitter<{ status: string, resource: any}>();
  @ViewChild(MatSort) sort: MatSort;


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource: MatTableDataSource<TableFormatConditionRq> = new MatTableDataSource<TableFormatConditionRq>([]);
  displayedColumns: string[] = ['name', 'position', 'formation', 'playCall', 'recordedDate'];


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data']?.currentValue && changes['data']?.currentValue?.length>0){
      this.dataSource.data = changes['data']?.currentValue;
    }
  }

  emitUpdateStatus(status: string, resource: any): void {
    this.onUpdateStatus.emit({ status, resource });
  }
}
