import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/conceptos')
  traerConceptos(): any {
    return this.appService.traerInfoConceptos();
  }

  @Get('/sedes')
  traerSedes(): any {
    return this.appService.traerSedes();
  }
}
