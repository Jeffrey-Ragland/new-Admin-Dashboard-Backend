import express from "express";
import {
  login,
  signup,
  InsertData,
  readLimitMain,
  read,
  readSensorGraph,
  BPCL,
  BPCL_READ,
  insertProjectData,
  BPCL_TOF_INSERT,
  BPCL_ASCAN_CLEAR,
  Creating_project,
  leveldata,
  // displayProjectData,
  levelinsert,
  levelchartdata,
  // displayProjectDataLimit,
  levelexceldata,
  // DisplayAllData,
  // displayProjectReportData,
  insertIOCLData,
  getIOCLData,
  insertDemokitUtmapsData,
  getDemokitUtmapsData,
  getDemokitUtmapsReport,
  insertDemokitPortsData,
  getDemokitPortsData,
  getDemokitPortsReport,
  insertDemokitZtarData,
  getDemokitZtarData,
  getDemokitZtarReport,
  getAutoDashData,
  getAutoDashReportData,
} from "../controllers/sensor.js";

const router = express.Router();

//register
router.get('/signup',signup);
router.post('/login',login);

//skf
router.get('/InsertData',InsertData);
router.get('/readLimitMain',readLimitMain); 
router.get('/read',read);
router.get('/readSensor/:sensorId',readSensorGraph);


//BPCL
router.get('/XYMA_BPCL',BPCL)
router.get('/BPCL_READ',BPCL_READ)
router.get('/BPCL_TOF_INSERT',BPCL_TOF_INSERT)
router.post('/BPCL_ASCAN_CLEAR',BPCL_ASCAN_CLEAR)

// automated dashboard
router.post('/Creating_project',Creating_project);
router.get("/insertProjectData", insertProjectData);
router.get("/getAutoDashData", getAutoDashData);
router.get("/getAutoDashReportData", getAutoDashReportData);
// router.post('/displayProjectDataLimit',displayProjectDataLimit);
// router.get('/displayProjectData',displayProjectData);
// router.get('/DisplayProjectReport',displayProjectReportData)
// router.get('/project_all_data',DisplayAllData);

//level mobile application
router.get('/levelinsert', levelinsert)
router.get('/leveldata/:id', leveldata)
router.get('/levelchartdata/:sensorId/:dataField', levelchartdata)
router.get('/levelexceldata', levelexceldata)

//iocl - jeff 
router.get('/insertIOCLData', insertIOCLData);
router.get('/getIOCLData', getIOCLData);

// demokit utmaps
router.get("/insertDemokitUtmapsData", insertDemokitUtmapsData);
router.get("/getDemokitUtmapsData", getDemokitUtmapsData);
router.get("/getDemokitUtmapsReport", getDemokitUtmapsReport);

// ports
router.get("/insertDemokitPortsData", insertDemokitPortsData);
router.get("/getDemokitPortsData", getDemokitPortsData);
router.get("/getDemokitPortsReport", getDemokitPortsReport);

// ztar
router.get("/insertDemokitZtarData", insertDemokitZtarData);
router.get("/getDemokitZtarData", getDemokitZtarData);
router.get("/getDemokitZtarReport", getDemokitZtarReport);

export default router;
