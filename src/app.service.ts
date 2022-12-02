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
    const {
      codConcepto,
      codTipoConcepto,
      idSede,
      idPeriodoAcademico,
      idPrograma,
    } = body;

    console.log('DATOS PARA TRAER FECHAS DE VENCIMIENTO:', body);

    try {
      let a;
      if (body.idPrograma === '[General]') {
        a = `select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede} and idPeriodoAcademico = ${idPeriodoAcademico} and idPrograma is null order by FechaInicioVigenciaPrecio`;
      } else {
        a = `select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede} and idPeriodoAcademico = ${idPeriodoAcademico} and idPrograma=${idPrograma} order by FechaInicioVigenciaPrecio `;
      }
      await sql.connect(config);

      const result = await sql.query(a);

      return result.recordsets[0];
    } catch (err) {
      return err;
    }
  }

  async traerFechasVencimientosVigentes(body: any) {
    const {
      codConcepto,
      codTipoConcepto,
      idSede,
      idPeriodoAcademico,
      idPrograma,
    } = body;
    try {
      let a;
      if (body.idPrograma === '[General]') {
        a = `select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede} and idPeriodoAcademico = ${idPeriodoAcademico} and idPrograma is null and FechaFinVigenciaPrecio >= GETDATE() order by FechaInicioVigenciaPrecio`;
      } else {
        a = `select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede} and idPeriodoAcademico = ${idPeriodoAcademico} and idPrograma=${idPrograma} and FechaFinVigenciaPrecio >= GETDATE() order by FechaInicioVigenciaPrecio `;
      }
      await sql.connect(config);

      const result = await sql.query(a);

      return result.recordsets[0];
    } catch (err) {
      return err;
    }
  }

  async traerProgramaAcademico(body) {
    const { valorIdSede, idPeriodoAcademico, valorCodTipoConcepto } = body;
    try {
      await sql.connect(config);
      const result =
        // await sql.query`select distinct idPrograma,NombreProgramaAcademico from InfoConceptos where idSede = ${valorIdSede} and idPeriodoAcademico = ${idPeriodoAcademico} and codTipoConcepto =${valorCodTipoConcepto}  order by NombreProgramaAcademico`;

        await sql.query` select distinct
IIf(idPrograma is Null, '[General]',CONVERT (VARCHAR,idPrograma)) as idPrograma,
IIf(NombreProgramaAcademico is null ,'[General]',CONVERT(VARCHAR,NombreProgramaAcademico)) as NombreProgramaAcademico
from InfoConceptos
where idSede = ${valorIdSede} and idPeriodoAcademico = ${idPeriodoAcademico} and codTipoConcepto =${valorCodTipoConcepto}  order by NombreProgramaAcademico`;

      return result.recordsets[0];
    } catch (error) {
      return error;
    }
  }
  async traerConceptos(body) {
    console.log('Valores para traer Conceptos:', body);
    const {
      valorIdSede,
      idPeriodoAcademico,
      valorCodTipoConcepto,
      valorProgramaAcademico,
    } = body;
    try {
      let a;
      if (valorProgramaAcademico === '[General]') {
        a = `select distinct codConcepto,DescripcionConcepto from InfoConceptos where idSede = ${valorIdSede} and idPeriodoAcademico=${idPeriodoAcademico} and codTipoConcepto=${valorCodTipoConcepto} and idPrograma is Null order by codConcepto`;
      } else {
        a = `select distinct codConcepto,DescripcionConcepto from InfoConceptos where idSede = ${valorIdSede} and idPeriodoAcademico=${idPeriodoAcademico} and codTipoConcepto=${valorCodTipoConcepto} and idPrograma=${valorProgramaAcademico} order by codConcepto`;
      }

      await sql.connect(config);
      const result = await sql.query(a);

      console.log(result.recordsets);
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

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('codConcepto', sql.Decimal, parseFloat(codConcepto))
      .input('idPeriodoAcademico', sql.Decimal, parseFloat(idPeriodoAcademico))
      .input('fechaInicioVigencia', sql.Date, fechaInicioVigencia)
      .input('fechaFinVigencia', sql.Date, fechaFinVigencia)
      .input('importeVto1', sql.Decimal(10, 2), parseFloat(importeVto1))
      .input('importeVto2', sql.Decimal(10, 2), parseFloat(importeVto2))
      .input('importeVto3', sql.Decimal(10, 2), parseFloat(importeVto3))
      .input('idUsuario', sql.Decimal, parseFloat(idUsuario))
      .output('ok', sql.bit)
      .output('mensaje', sql.VarChar(50))
      .execute('ConceptoCCActualizarPrecio ')
      .catch((err) => {
        console.log(err);
        return err;
      });

    return result;
  }
}
