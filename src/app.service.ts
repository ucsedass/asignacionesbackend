import { Injectable } from '@nestjs/common';
import Moment from 'moment';

require('tls').DEFAULT_MIN_VERSION = 'TLSv1';

var config = {
  user: 'devConceptos',
  password: 'qwerty',
  server: 'sgo-desarrollo',
  database: 'GestionConceptos',
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

var sql = require('mssql');
@Injectable()
export class AppService {
  async traerFechasVencimientos(body: any) {
    const { codConcepto, codTipoConcepto, idSede, idPeriodoAcademico } = body;
    console.log(body);
    try {
      await sql.connect(config);

      const result =
        await sql.query`select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede} and idPeriodoAcademico = ${idPeriodoAcademico}`;
      // console.log(result.recordsets[0]);
      return result.recordsets[0];
    } catch (err) {
      return err;
    }
  }

  async traerFechasVencimientosVigentes(body: any) {
    const { codConcepto, codTipoConcepto, idSede, idPeriodoAcademico } = body;
    console.log('ESTO ES LO QUE LLEGAAAA::', body);
    try {
      await sql.connect(config);

      const result =
        await sql.query`select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede} and idPeriodoAcademico=${idPeriodoAcademico} and FechaFinVigenciaPrecio >= GETDATE() `;
      // console.log(result.recordsets[0]);
      return result.recordsets[0];
    } catch (err) {
      return err;
    }
  }

  async traerConceptos() {
    try {
      await sql.connect(config);
      const result =
        await sql.query`select distinct codConcepto,DescripcionConcepto from InfoConceptos order by codConcepto`;
      return result.recordsets[0];
    } catch (err) {
      return err;
    }
  }

  async traerTipoConceptos() {
    try {
      await sql.connect(config);
      const result =
        await sql.query`select distinct codTipoConcepto,DescripcionTipoConcepto from InfoConceptos order by codTipoConcepto`;
      return result.recordsets[0];
    } catch (err) {
      return err;
    }
  }

  async traerSedes() {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().execute('sedesTraerTodas');
      return result.recordsets[0];
    } catch (error) {
      return error;
    }
  }

  async agregarFechasVencimientos(body: any) {
    const {
      codConcepto,
      idPeriodoAcademico,
      fechaInicioVigencia,
      fechaFinVigencia,
      importeVto1,
      importeVto2,
      importeVto3,
      idUsuario,
    } = body;

    console.log(
      'PARAMETROS ',
      codConcepto,
      idPeriodoAcademico,
      fechaInicioVigencia,
      fechaFinVigencia,
      importeVto1,
      importeVto2,
      importeVto3,
      idUsuario,
    );
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input('codConcepto', sql.Decimal, parseFloat(codConcepto))
        .input(
          'idPeriodoAcademico',
          sql.Decimal,
          parseFloat(idPeriodoAcademico),
        )
        .input('fechaInicioVigencia', sql.Date, fechaInicioVigencia)
        .input('fechaFinVigencia', sql.Date, fechaFinVigencia)
        .input('importeVto1', sql.Decimal, parseFloat(importeVto1))
        .input('importeVto2', sql.Decimal, parseFloat(importeVto2))
        .input('importeVto3', sql.Decimal, parseFloat(importeVto3))
        .input('idUsuario', sql.Decimal, parseFloat(idUsuario))
        .execute('ConceptoCCActualizarPrecio ');

      console.log('exito');
      return result;
    } catch (error) {
      console.log('error:', error);

      return error;
    }
  }
}
