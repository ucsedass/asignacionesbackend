import { Controller, Get, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/fechasvencimientos')
  traerFechasVencimientos(@Body() body: any): any {
    return this.appService.traerFechasVencimientos(body);
  }
  @Post('/agregarfechasvencimientos')
  agregarFechasVencimientos(@Body() body: any): any {
    return this.appService.agregarFechasVencimientos(body);
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
