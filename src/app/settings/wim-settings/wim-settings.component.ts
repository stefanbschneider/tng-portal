import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SettingsService } from '../settings.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
    selector: 'app-wim-settings',
    templateUrl: './wim-settings.component.html',
    styleUrls: [ './wim-settings.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class WimSettingsComponent implements OnInit {
    loading: boolean;
    wims: Array<Object>;
    displayedColumns = [
        'name',
        'type',
        'endpoint',
        'delete'
    ];

    constructor(private settingsService: SettingsService, private commonService: CommonService) { }

    ngOnInit() {
        this.requestWims();
    }

    searchFieldData(search) {
        this.requestWims(search);
    }

    /**
         * Generates the HTTP request to get the list of WIMs.
         *
         * @param search [Optional] WIMs attributes that
         *                          must be matched by the returned
         *                          list.
         */
    requestWims(search?) {
        this.loading = true;
        this.settingsService.getWims(search)
            .then(response => {
                this.loading = false;
                this.wims = response;
            })
            .catch(error => {
                this.loading = false;
                console.error(error);
                this.commonService.openSnackBar('There was an error fetching the WIMs', '');
            });
    }

    deleteWim(uuid) {

    }
}
