import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-packages-detail",
  templateUrl: "./packages-detail.component.html",
  styleUrls: ["./packages-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesDetailComponent implements OnInit {
  displayedColumns = ["name", "vendor", "version"];
  displayedColumnsTests = ["name", "creationDate", "status", "lastActivity"];
  searchText: string;
  loading: boolean;

  name: string;
  author: string;
  createdAt: string;
  vendor: string;
  version: string;
  type: string;
  ns: Array<Object>;
  vnf: Array<Object>;
  tests: Array<Object>;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;

    this.route.params.subscribe(params => {
      let uuid = params["id"];

      this.serviceManagementService
        .getPackage(uuid)
        .then(response => {
          this.loading = false;

          this.name = response.name;
          this.author = response.author;
          this.createdAt = response.createdAt;
          this.vendor = response.vendor;
          this.version = response.version;
          this.type = response.type;

          // TODO request to /packages/package_file_id
          this.ns = [];
          this.vnf = [];
          this.tests = [];
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
          } else {
            this.close();
          }
        });
    });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

  close() {
    this.router.navigate(["service-platform/packages"]);
  }
}
