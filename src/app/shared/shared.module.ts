import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DialogDataService } from './services/dialog/dialog.service';
import { CommonService } from './services/common/common.service';
import { UtilsService } from './services/common/utils.service';
import { ConfigService } from './services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { ChartService } from './services/common/chart.service';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SelectComponent } from './components/select/select.component';
import { SelectUuidComponent } from './components/select/select-uuid.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FeatureAvailableDirective } from './directives/feature-available.directive';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FunctionsComponent } from './components/functions/functions.component';

export function initConfiguration(configService: ConfigService): Function {
	return () => configService.init();
}

@NgModule({
	declarations: [
		CalendarComponent,
		DialogComponent,
		SearchBarComponent,
		SelectComponent,
		SelectUuidComponent,
		SpinnerComponent,
		FeatureAvailableDirective,
		FunctionsComponent
	],
	entryComponents: [ DialogComponent ],
	imports: [
		CommonModule,
		AngularMaterialModule,
		ReactiveFormsModule,
		FormsModule,
		AppRoutingModule
	],
	exports: [
		CalendarComponent,
		DialogComponent,
		SearchBarComponent,
		SelectComponent,
		SelectUuidComponent,
		SpinnerComponent,
		FeatureAvailableDirective,
		FunctionsComponent
	],
	providers: [
		ConfigService,
		AuthService,
		ConfigService,
		CommonService,
		UtilsService,
		DialogDataService,
		ChartService,
		{
			provide: APP_INITIALIZER,
			useFactory: initConfiguration,
			deps: [ ConfigService ],
			multi: true
		}
	]
})
export class SharedModule { }
