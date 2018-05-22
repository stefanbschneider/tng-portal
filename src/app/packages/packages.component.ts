import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { DataTransferService } from "../shared/services/service-management/dataTransfer.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-packages",
  templateUrl: "./packages.component.html",
  styleUrls: ["./packages.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesComponent implements OnInit {
  loading: boolean;
  packages = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["Name", "Vendor", "Created at", "Version", "Type"];
  searchText: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute,
    private dataTransfer: DataTransferService
  ) {}

  ngOnInit() {
    this.requestPackages();
  }

  requestPackages() {
    this.loading = true;

    this.serviceManagementService
      .getPackages()
      .then(response => {
        this.loading = false;
        this.packages = response;
      })
      .catch(err => {
        this.loading = false;

        // Dialog informing the user to log in again when token expired
        if (err === "Unauthorized") {
          let title = "Your session has expired";
          let content =
            "Please, LOG IN again because your access token has expired.";
          let action = "Log in";

          this.dialogData.openDialog(title, content, action, () => {
            this.router.navigate(["/login"]);
          });
        }
      });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

  openPackage(row) {
    let uuid = row.uuid;
    let detail = this.packages.find(x => x.uuid === uuid);
    this.dataTransfer.sendDetail(detail);
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
