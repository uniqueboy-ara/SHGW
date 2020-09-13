const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const auth = require("../../middleware/auth");
const db = sworm.db(setting.db.sqlConfig);

//#region Unload Services -------------------------------------------------------------------------

router.post("/getCntrInfoForUnload", auth, async (req, res) => {
  try {
    var result = await db.query(queries.VESSEL.BERTH.getCntrInfoForUnload, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
    });
    return SendResponse(req, res, result, result && result.length > 0);
  } catch (error) {
    return SendResponse(req, res, `getCntrInfoForUnload(${req.body.voyageId},${req.body.cntrNo})`, false, 500);
  }
});

router.post("/saveUnload", auth, async (req, res) => {

  try {
    var result = await db.query(queries.VESSEL.BERTH.saveUnload, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
      berthId: req.body.berthId,
      userId: req.body.userId,
      equipmentId: req.body.equipmentId,
      operatorId: req.body.operatorId,
      truckNo: req.body.truckNo,
      isShifting: req.body.isShifting,
      sE: req.body.sE,
      oG: req.body.oG,
    });
    //[ { '': [ '12329941', 'OK' ] } ]
    //console.log('result unload save', result);
    let data = result[0][""][0] !== '0' ? {
      ActId: result[0][""][0],
      message: "عملیات با موفقیت انجام شد",
    } : 'خطا در انجام عملیات';

    var result2 = await db.query(queries.VOYAGE.getLoadUnloadStatisticsByVoyageId, { voyageId: req.body.voyageId });
    //console.log(result2);
    res.io.emit("get_data", result2);

    return SendResponse(req, res, data, result[0][""][0] !== '0');
  } catch (error) {
    return SendResponse(req, res, 'saveUnload', false, 500);
  }
  //#region 
  //   db.transaction(() => {
  //     return db.query(queries.VESSEL.BERTH.saveUnload, {
  //     voyageId: req.body.voyageId,
  //     cntrNo: req.body.cntrNo,
  //     berthId: req.body.berthId,
  //     userId: req.body.userId,
  //     equipmentId: req.body.equipmentId,
  //     operatorId: req.body.operatorId,
  //     truckNo: req.body.truckNo,
  //     isShifting: req.body.isShifting,
  //     sE: req.body.sE,
  //     oG: req.body.oG,
  //   })
  //       .then(() => SendResponse(req, res, 'عملیات با موفقیت انجام شد'))
  //       .catch(() => SendResponse(req, res, { error: 'خطای سرور' }, false, 500))
  //   });

  //#endregion
});

router.post("/saveUnloadIncrement", auth, async (req, res) => {

  try {
    // console.log('ezafe takhlie')
    var result = await db.query(queries.VESSEL.BERTH.saveUnloadIncrement, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
      berthId: req.body.berthId,
      userId: req.body.userId,
      equipmentId: req.body.equipmentId,
      operatorId: req.body.operatorId,
      terminalId: req.body.terminalId,
      truckNo: req.body.truckNo,
      isShifting: req.body.isShifting,
      sE: req.body.sE,
      oG: req.body.oG,
    });

    let data = result[0][""][0] !== '0' ? {
      ActId: result[0][""][0],
      message: "عملیات با موفقیت انجام شد",
    } : 'خطا در انجام عملیات';

    var result2 = await db.query(queries.VOYAGE.getLoadUnloadStatisticsByVoyageId, { voyageId: req.body.voyageId });
    //console.log('increment data', result2);
    res.io.emit("get_data", result2);

    return SendResponse(req, res, data, result[0][""][0] !== '0');
  } catch (error) {
    return SendResponse(req, res, 'saveUnloadIncrement', false, 500);
  }
});

router.post("/addToShifting", auth, async (req, res) => {
  try {
    var result = await db.query(queries.VESSEL.BERTH.addToShifting, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
      staffId: req.body.staffId,
    });

    if (result && result.length > 0)
      return SendResponse(req, res, "کانتینر به لیست شیفتینگ اضافه شد");
    else return SendResponse(req, res, "کانتینر به لیست شیفتینگ اضافه نشد", false);
  } catch (error) {
    return SendResponse(req, res, 'addToShifting', false, 500);
  }
});

router.post("/addToLoadingList", auth, async (req, res) => {
  try {
    var result = await db.query(queries.VESSEL.BERTH.addToLoadingList, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
    });

    if (result && result.length > 0)
      SendResponse(req, res, "کانتینر به لیست دستورالعمل بارگیری اضافه شد");
    else
      return SendResponse(req, res, "کانتینر به لیست دستورالعمل بارگیری اضافه نشد", false);
  } catch (error) {
    return SendResponse(req, res, 'addToLoadingList', false, 500);
  }
});

router.post("/isExistCntrInInstructionLoading", auth, async (req, res) => {
  try {
    var result = await db.query(
      queries.VESSEL.BERTH.isExistCntrInInstructionLoading,
      {
        voyageId: req.body.voyageId,
        cntrNo: req.body.cntrNo,
      }
    );

    if (result && result.length > 0)
      return SendResponse(req, res, result, result && result.length > 0);
    else
      return SendResponse(req, res, "کانتینر در لیست دستورالعمل بارگیری وجود ندارد", false);
  } catch (error) {
    return SendResponse(req, res, 'isExistCntrInInstructionLoading', false, 500);
  }
});

//#endregion -------------------------------------------------------------------------------------

router.post("/getCntrInfoForLoad", auth, async (req, res) => {

  try {
    var result = await db.query(queries.VESSEL.BERTH.getCntrInfoForLoad, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
    });
    return SendResponse(req, res, result, result && result.length > 0);
  } catch (error) {
    return SendResponse(req, res, 'getCntrInfoForLoad', false, 500);
  }

});


router.post("/saveLoad", auth, async (req, res) => {

  try {
    var result = await db.query(queries.VESSEL.BERTH.saveLoad, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
      berthId: req.body.berthId,
      userId: req.body.userId,
      equipmentId: req.body.equipmentId,
      operatorId: req.body.operatorId,
      truckNo: req.body.truckNo,
      isShifting: req.body.isShifting,
      sE: req.body.sE,
      oG: req.body.oG,
    });

    console.log('load save', result);
    let data = result[0][""][0] !== '0' ? {
      ActId: result[0][""][0],
      message: "عملیات با موفقیت انجام شد",
    } : 'خطا در انجام عملیات';

    var result2 = await db.query(queries.VOYAGE.getLoadUnloadStatisticsByVoyageId, { voyageId: req.body.voyageId });
    //console.log(result2);
    res.io.emit("get_data", result2);

    return SendResponse(req, res, data, result[0][""][0] !== '0');
  } catch (error) {
    return SendResponse(req, res, 'saveLoad', false, 500);
  }



  //#region 
  //   db.transaction(() => {
  //     return db.query(queries.VESSEL.BERTH.saveUnload, {
  //     voyageId: req.body.voyageId,
  //     cntrNo: req.body.cntrNo,
  //     berthId: req.body.berthId,
  //     userId: req.body.userId,
  //     equipmentId: req.body.equipmentId,
  //     operatorId: req.body.operatorId,
  //     truckNo: req.body.truckNo,
  //     isShifting: req.body.isShifting,
  //     sE: req.body.sE,
  //     oG: req.body.oG,
  //   })
  //       .then(() => SendResponse(req, res, 'عملیات با موفقیت انجام شد'))
  //       .catch(() => SendResponse(req, res, { error: 'خطای سرور' }, false, 500))
  //   });

  //#endregion
});

module.exports = router;
