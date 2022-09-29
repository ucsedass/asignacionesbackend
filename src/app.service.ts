import { Injectable } from '@nestjs/common';

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

// var config = {
//   user: 'sa',
//   password: '368DataPhobia',
//   server: 'TCUENTASPRUEBA',
//   database: 'dbtcj',
//   options: {
//     trustedConnection: true,
//     encrypt: true,
//     enableArithAbort: true,
//     trustServerCertificate: true,
//   },
// };

var sql = require('mssql');
@Injectable()
export class AppService {
  async traerFechasVencimientos(body: any) {
    // sql.connect(config, function (err) {
    //   if (err) console.log(err);
    //   var request = new sql.Request();
    //   request.query(`select * from MulCuentadantes`, function (err, recordset) {
    //     if (err) console.log(err);
    //     console.log(recordset);// aqui muestro los datos correctamente
    //     sql.close();
    //   });
    // });

    const { codConcepto, codTipoConcepto, idSede } = body;

    try {
      await sql.connect(config);
      const result =
        await sql.query`select PrecioVto1,PrecioVto2,PrecioVto3,FechaInicioVigenciaPrecio,FechaFinVigenciaPrecio from InfoConceptos where codConcepto =${codConcepto} and codTipoConcepto =${codTipoConcepto} and idSede = ${idSede}`;
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

  async agregarFechasVencimientos() {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().execute('sedesTraerTodas');
      return result.recordsets[0];
    } catch (error) {
      return error;
    }
  }
}
