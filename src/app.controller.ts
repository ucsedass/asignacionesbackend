import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/fechasvencimientos')
  traerFechasVencimientos(): any {
    return this.appService.traerFechasVencimientos();
  }

  @Get('/sedes')
  traerSedes(): any {
    return this.appService.traerSedes();
  }
  @Get('/conceptos')
  traerConceptos(): any {
    return this.appService.traerConceptos();
  }

  @Get('/tipoconceptos')
  traerTipoConceptos(): any {
    return this.appService.traerTipoConceptos();
  }
}
