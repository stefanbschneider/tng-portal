import { Injectable } from "@angular/core";
import { ConfigService } from "../config/config.service";
import { AuthService } from "../../../authentication/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class CommonService {
  authHeaders: HttpHeaders;
  request_uuid: string;

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of Packages.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getPackages(section, search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url: string;

      if (section == "VALIDATION AND VERIFICATION") {
        url =
          search != undefined
            ? this.config.baseVNV + this.config.packages + search
            : this.config.baseVNV + this.config.packages;
      } else {
        url =
          search != undefined
            ? this.config.baseSP + this.config.packages + search
            : this.config.baseSP + this.config.packages;
      }

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.pd.name,
                  vendor: item.pd.vendor,
                  version: item.pd.version,
                  createdAt: item.created_at,
                  status: item.status,
                  type: "public"
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Functions.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getFunctions(section, search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let url: string;
      if (section == "VALIDATION AND VERIFICATION") {
        url =
          search != undefined
            ? this.config.baseVNV + this.config.functions + search
            : this.config.baseVNV + this.config.functions;
      } else {
        url =
          search != undefined
            ? this.config.baseSP + this.config.functions + search
            : this.config.baseSP + this.config.functions;
      }

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.vnfd.name,
                  vendor: item.vnfd.vendor,
                  status: item.status,
                  version: item.vnfd.version,
                  type: "public"
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of SLA Templates.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Template attributes that must be
   *                          matched by the returned list of
   *                          SLA Templates.
   */
  getSLATemplates(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slaTemplates + search
          : this.config.baseSP + this.config.slaTemplates;
      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  vendor: item.slad.vendor,
                  name: item.slad.name,
                  version: item.slad.version,
                  nsUUID: item.slad.sla_template.ns.ns_uuid,
                  ns: item.slad.sla_template.ns.ns_name,
                  expirationDate: new Date(item.slad.sla_template.valid_until)
                    .toISOString()
                    .replace(/T.*/, "")
                    .split("-")
                    .reverse()
                    .join("/"),
                  status: item.status
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Available Network Services.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Network Service attributes that
   *                          must be matched by the returned
   *                          list of NS.
   */
  getNetworkServices(section, search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let url: string;
      if (section == "VALIDATION AND VERIFICATION") {
        url =
          search != undefined
            ? this.config.baseVNV + this.config.services + search
            : this.config.baseVNV + this.config.services;
      } else {
        url =
          search != undefined
            ? this.config.baseSP + this.config.services + search
            : this.config.baseSP + this.config.services;
      }

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => ({
                name: item.nsd.name,
                serviceId: item.uuid,
                vendor: item.nsd.vendor,
                version: item.nsd.version,
                status: item.status,
                licenses: "None",
                slas: "/service-platform/slas/sla-templates"
              }))
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Network Service by UUID
   *
   * @param uuid UUID of the desired Network Service.
   */
  getOneNetworkService(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.services + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("nsd")) {
            resolve({
              name: response["nsd"]["name"],
              author: response["nsd"]["author"],
              version: response["nsd"]["version"],
              status: response["status"],
              vendor: response["nsd"]["vendor"],
              serviceID: response["uuid"],
              type: response["user_licence"],
              description: response["nsd"]["description"],
              createdAt: response["created_at"],
              updatedAt: response["updated_at"]
            });
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves the existing vims represented by the city name
   */
  requestVims(): any {
    return ["Athens", "Aveiro", "Barcelona", "Paderborn"];
  }
}
