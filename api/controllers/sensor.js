import bpclModel from '../model/bpclModel.js';
import bpcl_tof_insert from '../model/bpcl_tof_insert.js';
import Data from '../model/sensorModel.js';
import EmployeeModel from '../model/userModel.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import axios from 'axios';
import levelmodel from '../model/levelmodel.js';
import ioclModel from '../model/ioclModel.js';
import demokitUtmapsModel from '../model/demokitUtmapsModel.js';
import demokitPortsModel from '../model/demokitPortsModel.js';
import demokitZtarModel from '../model/demokitZtarModel.js';
import processControlModel from '../model/processControlModel.js';
import demokitUtmapsIndicationModel from '../model/demokitUtmapsIndicationModel.js';

//Register
// http://localhost:4000/sensor/signup?project=[projectName]&userid=[email]&password=[password]
export const signup =async (req,res) =>
{
    try{
        const {project,userid,password} = req.query;
       // console.log("project name",project,userid,password)
        const newPassword = await bcrypt.hash(password, 10);
        await EmployeeModel.create({
            Project:project,
            Email:userid,
            Password:newPassword,
        })

        res.status(200).json({ message: "Password received successfully" });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
   

    // .then(hash => 
    //     {
    //         EmployeeModel.create({Project,Email,Password: hash})
    //         .then(employees => res.json(employees))
    //         .catch(err => res.json(err))
    //     })
    // .catch(err => console.log(err.message))
    
};

//login
export const login = (req,res) =>
{
    const {Project,Email, Password} = req.body;

    EmployeeModel.findOne({Project: Project,Email: Email})
    .then(user =>
        {
            if(user)
            {
                bcrypt.compare(Password, user.Password, (err, response) =>
                {
                    if(response)
                    {
                        let redirectUrl = '';
                        let projectNumber = "";
                        if (user.Project === "SKF") {
                          redirectUrl = "SKF";
                        } else if (user.Project === "ADMIN") {
                          redirectUrl = "ADMIN";
                        } else if (user.Project === "BPCL") {
                          redirectUrl = "BPCL";
                        } else if (user.Project === "IOCL") {
                          redirectUrl = "IOCL";
                        } else if (user.Project === "DRDO") {
                          redirectUrl = "DRDO";
                        } else if (user.Project.startsWith('DEMOKIT')) {
                          projectNumber = user.Project;
                          redirectUrl = "DEMOKIT";
                        }
                        else {
                          redirectUrl = 'AutomatedDashboard'
                        }

                        // token generation
                        const token = jwt.sign({Email: user.Email}, "jwt-secret-key", {expiresIn:"1d"});
                        // role assignment
                        let role='';
                        if(user.Email === 'admin@xyma.in')
                        {
                            role = 'admin';
                        }
                        else if(user.Email !== 'admin@xyma.in')
                        {
                            role = 'client';
                        }
                
                        res.json({token : token, role: role, redirectUrl: redirectUrl, projectNumber}); 
                    }
                    else
                    {
                        res.json("Incorrect Password")
                    }
                })
            } 
            else
            {
                res.json("invalid user")
            }
        })
        .catch(err => console.log(err));
};


export const InsertData = async (req, res) => {
    const { sensor1, sensor2, sensor3, sensor4, sensor5, other, timestamp } = req.query;
    if (!sensor1 || !sensor2 || !sensor3 || !sensor4 || !sensor5 || !other || !timestamp) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    try {
        const newData = {
            sensor1: sensor1,
            sensor2: sensor2,
            sensor3: sensor3,
            sensor4: sensor4,
            sensor5: sensor5,
            other: other,
            timestamp: timestamp,
        };
        await bpcl_tof_insert.create(newData); // Use Data instead of sensor
        res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// iocl - jeff api

// http://localhost:4000/sensor/insertIOCLData?sensor1=20&sensor2=30&sensor3=40
export const insertIOCLData = async (req,res) => 
{
    const {sensor1, sensor2, sensor3} = req.query;

    if (!sensor1 || !sensor2 || !sensor3 ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    try {
      const ioclData = {
        Sensor1: sensor1,
        Sensor2: sensor2,
        Sensor3: sensor3,
      };
      await ioclModel.create(ioclData);
      res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const getIOCLData = async (req,res) => {
    try {
        const limit = parseInt(req.query.limit);
        const ioclData = await ioclModel.find().sort({ _id: -1 }).limit(limit);

        if(ioclData.length > 0) {
            res.json({success: true, data: ioclData});
        } else {
            res.json({ success: false, message: "IOCL Data not found" });
        }
    } catch(error) {
        res.status(500).json({error});
    }
};


//jeffery code

export const readLimitMain =  async(req,res) =>
{
    const id= req.params.id;

    const data = await Data.find().sort({_id: -1}).limit(30);
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};


export const read =  async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await Data.find().sort({_id: -1});
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};


export const readSensorGraph =  async(req, res) =>
{
    const sensorId = req.params.sensorId;
    const limit = parseInt(req.query.limit); //data limit
    const data = await Data.find().sort({_id: -1}).limit(limit).select(`sensor${sensorId} Time`);
    if(data)
    {
        res.json({success: true, data: data.reverse()});
    }
    else
    {
        res.json({success: false, message: "data not found"});
    }

};






//BPCL INSERT LINK
export const BPCL = async(req,res)=>{
    const requiredParams = Array.from({ length: 50 }, (_, i) => `ac${i + 1}`);

    const missingParams = requiredParams.filter(param => !req.query[param]);
    if (missingParams.length > 0) {
        return res.status(400).json({ error: "Missing required parameters: " + missingParams.join(',') });
    }
    try{
        const acValues = [];
        for (const param of requiredParams) {
            acValues.push(req.query[param]);
        }
        console.log('All AC values:', acValues);

        await bpclModel.create({ acValues });
        res.status(200).json({ message: "[success]" });
    } catch(err){
        res.status(500).json({ error: err.message });
    }
}

//BPCL READ LINK
export const BPCL_READ = async (req, res) => {
    try {
        const alldata = await bpclModel.find().sort();


        if (alldata.length > 0) {
            // Flatten the array of arrays to a single array
            const acValues = alldata.reduce((acc, curr) => acc.concat(curr.acValues), []);

            res.json({ success: true, data: acValues});
        } else {
            res.json({ success: false, message: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const BPCL_TOF_INSERT = async (req,res)=>{
    const {tof1,tof2,tof3,tof4,other}=req.query;
    if (!tof1 || !tof2 || !tof3 || !tof4 || !other ) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    try{

        const date = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        };
        const formattedTimestamp = date.toLocaleString('en-US', options);


        const responseData = [`#000002,100000,000100,000002,000007,%008000,014000,018000,024000,039000,045000,048000,056000,059000,066000,070000,077000,080000,087000%,000150,000100,000001#,24`]
        const Tofdata = {
            tof1:tof1,
            tof2:tof2,
            tof3:tof3,
            tof4:tof4,
            other:other,
            time:formattedTimestamp,
        };
        await bpcl_tof_insert.create(Tofdata);
        res.status(200).json(responseData);

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const BPCL_ASCAN_CLEAR = async(req,res) =>{
    try {
        await mongoose.connection.db.dropCollection('bpcl_ascans');
        res.status(200).json({ message: 'Collection deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete collection' });
      }
}





// AUTOMATED DASHBOARD

// register link
export const Creating_project = async (req, res) => {
  try {
    const { data } = req.body;
    const existingProject = await EmployeeModel.findOne({
      Project: data.projectName,
    });

    if (existingProject) {
      return res.status(409).json({ message: "Project already exists" });
    }

    let password = await bcrypt.hash(data.password, 10);

    const newProject = new EmployeeModel({
      Project: data.projectName,
      Email: data.email,
      Password: password,
      Parameters: data.parameters,
      ParameterValues: data.parameterValues,
    });

    newProject
      .save()
      .then(() => {
        res.status(201).json({ message: "Project stored" });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// insert link
const projectDataSchema = new mongoose.Schema({}, { timestamps: true });

export const insertProjectData = (req, res) => {
  const projectName = req.query.projectName;
  const parameterValues = Object.keys(req.query).filter(
    (key) => key !== "projectName"
  );

  //creates dynamic schema
  const dynamicSchema = {};
  parameterValues.forEach((param) => {
    dynamicSchema[param] = String;
  });

  console.log(dynamicSchema);
  projectDataSchema.add(dynamicSchema);

  const projectDataModel =
    mongoose.models[projectName] ||
    mongoose.model(projectName, projectDataSchema, projectName);

  //creates dynamic field according to parameterValues
  const projectDataObject = {};
  parameterValues.forEach((param) => {
    projectDataObject[param] = req.query[param];
  });

  const projectData = new projectDataModel(projectDataObject);
  projectData
    .save()
    .then(() => {
      res.status(201).json({ message: "Project data stored" }); 
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// get link
export const getAutoDashData = async (req, res) => {
  try {
    const projectName = req.query.project;
    const limit = parseInt(req.query.limit);

    const collection = mongoose.connection.db.collection(projectName);
    const autoDashData = await collection
      .find({})
      .sort({ _id: -1 })
      .limit(limit)
      .project({__v: 0, updatedAt: 0, _id: 0})
      .toArray();

    if (autoDashData.length > 0) {
      res.json({ success: true, data: autoDashData });
    } else {
      res.json({ success: true, data: `Collection ${projectName} not found` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// report link
export const getAutoDashReportData = async (req, res) => {
  try {
    const {
      projectName,
      fromDate,
      toDate,
      count,
      unselectedSensors,
      sensorWiseFromDate,
      sensorWiseToDate,
      sensorWiseCount,
    } = req.query;

    const collection = mongoose.connection.db.collection(projectName);

    let query = {};
    let sort = { _id: -1 };
    const unselectedSensorsArray = unselectedSensors ? unselectedSensors.split(",") : [];

    if (fromDate || toDate) {
      const newToDate = new Date(toDate);
      newToDate.setDate(newToDate.getDate() + 1);

      query = {
        createdAt: { $gte: new Date(fromDate), $lte: newToDate },
      };
    };

    if(sensorWiseFromDate || sensorWiseToDate) {
      const newSensorWiseToDate = new Date(sensorWiseToDate);
      newSensorWiseToDate.setDate(newSensorWiseToDate.getDate() + 1);

      query = {
        createdAt: {
          $gte: new Date(sensorWiseFromDate),
          $lte: newSensorWiseToDate,
        },
      };
    };

    let projection = { __v: 0, updatedAt: 0, _id: 0,};

    if (unselectedSensorsArray.length > 0) {
      unselectedSensorsArray.forEach((sensor) => {
        projection[sensor] = 0;
      });
    };

    let cursor = collection.find(query).sort(sort).project(projection);

    if (count) {
      cursor = cursor.limit(parseInt(count));
    };

    if(sensorWiseCount) {
      cursor = cursor.limit(parseInt(sensorWiseCount));
    };

    const autoDashReportData = await cursor.toArray();

    res.json({ success: true, data: autoDashReportData });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    };
  };



// export const displayProjectData = async (req, res) => {
//     try{
//         const {project} = req.query;
//         let a = project
//         const collection = mongoose.connection.db.collection(a);
//         const projectData = await collection.find({}).sort({_id: -1}).limit(100).toArray();
//         if(projectData.length >0){
//             res.json({success: true, data: projectData });
//         }
//         else 
//         {
//             res.json({success: true, data: `Collection ${projectName} not found` });
//         }

//     }catch(error){
//         res.status(500).json({ error: error.message });
//     }
// }

// export const displayProjectDataLimit = async (req,res) => {
//     const {projectName, limit} = req.body;
//     const collection = mongoose.connection.db.collection(projectName);
//     const projectData = await collection.find({}).sort({_id: -1}).limit(limit).toArray();
//     let result = '';
//         if (projectData.length > 0) 
//         {
//             console.log(`Collection ${projectName} found`);
//             res.json({ result: `Collection ${projectName} found`,success: true, data: projectData });
//         } 
//         else 
//         {
//             console.log(`Collection ${projectName} not found`);
//             result = `Collection ${projectName} not found`;
//         }
// }

// export const displayProjectReportData = async (req, res) => {
//     try{
//         const {project,Count} = req.query;
//         let a = project
//         let b =parseInt(Count)
//         const collection = mongoose.connection.db.collection(a);
//         const projectData = await collection.find({}).sort({_id: -1}).limit(b).toArray();
//         if(projectData.length >0){
//             res.json({success: true, data: projectData });
//         }
//         else 
//         {
//             res.json({success: true, data: `Collection ${projectName} not found` });
//         }
//     }catch(error){
//         res.status(500).json({ error: error.message });
//     }
// }


// export const DisplayAllData = async (req, res) => {
//     try{
//         const {project,sensorname,chartlength} = req.query;
        
//         let a = project
//         let b = parseInt(chartlength);
//         const query = {};
//         query[sensorname] = { $exists: true };

//         const collection = mongoose.connection.db.collection(a);
//         const projectData = await collection.find({}).sort({_id: -1}).limit(b).toArray();
//         const sensor1Data = projectData.map(doc => doc[sensorname]);
    
//         if(sensor1Data.length >0){
//             res.json({success: true, data: sensor1Data });
           
//         }
//         else 
//         {
//             res.json({success: true, data: `Collection ${projectName} not found` });
//         }

//     }catch(error){
//         res.status(500).json({ error: error.message });
//     }
// }


  //level mobile application
  export const levelinsert = async (req, res) => {
    const {
        id,
        level,
        devicetemp,
        signal,
        batterylevel,
        humidity,
        pressure,
        altitude,
        datafrequency
    } = req.query;

    const saveAsset = new levelmodel({
        id: String(id),
        level: String(level),
        devicetemp: String(devicetemp),
        signal: String(signal),
        batterylevel: String(batterylevel),
        humidity: String(humidity),
        pressure: String(pressure),
        altitude: String(altitude),
        datafrequency: String(datafrequency)
    });

    try {
        const savedAsset = await saveAsset.save();
        res.status(200).json(savedAsset);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const leveldata = async (req, res) => {
    const { id } = req.params; 
    // console.log("Received ID:", id);  

    try {
        
        const data = await levelmodel.findOne({id: id}).sort({_id: -1}).limit(1);

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "No data found for the given sensor ID" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};


export const levelchartdata = async (req, res) => {
        const { sensorId, dataField } = req.params; 
      
        try {
            const results = await levelmodel.find({ id: sensorId }).sort({ createdAt: -1 }).limit(30);
      
            if (results.length === 0) {
                res.status(404).json({ message: `No data found for sensor ID ${sensorId}` });
            } else {
                // Assuming you want to return all entries with the specific field
                const filteredData = results.filter(doc => doc[dataField] != null).map(doc => ({
                // id: doc.id
                    [dataField]: doc[dataField],
                    createdAt: doc.createdAt
                }));
      
                if (filteredData.length > 0) {
                    res.status(200).json(filteredData);
                } else {
                    res.status(404).json({ message: `No data found for sensor ID ${sensorId} with the requested field: ${dataField}` });
                }
            }
        } catch (error) {
            console.error("Error fetching sensor data:", error);
            res.status(500).json({ message: "Internal server error while fetching sensor data" });
        }
      };
      


      export const levelexceldata = async (req, res) => {
        const { id: deviceid, date1, date2 } = req.query;
      
        try {
          const startDate = new Date(date1);
          const endDate = new Date(date2);
      
          const assetDocumentArray = await levelmodel.find({
            id: deviceid,
            $and: [
              { createdAt: { $gte: startDate } },
              { createdAt: { $lte: endDate } },
            ],
          });
          console.log("Device ID:", deviceid);
          console.log("Start Date:", startDate);
          console.log("End Date:", endDate);
      
          console.log("Found asset documents:", assetDocumentArray);
      
          res.json(assetDocumentArray);
        } catch (error) {
          console.error("Error:", error);
          res
            .status(500)
            .json({ error: "Internal Server Error", details: error.message });
        }
      };


// process control to indicate current project
export const updateProcessControl = async (req,res) => {
  // const data = await axios.get("http://localhost:4000/sensor/getProcessControl");
  // if(data.status === 200) {
  //   console.log(data.currentProject);
  // }
  // console.log(data);
  const {projectName} = req.body;

  try {
    await processControlModel.findOneAndUpdate({}, {$set: { currentProject: projectName }},  { new: true, upsert: true });
    res.status(200).send('Project updated successfully');
  } catch(error) {
    res.status(500).send('Error updating project');
  };
};

// http://localhost:4000/sensor/getProcessControl
export const getProcessControl = async (req,res) => {
  try {
    const project = await processControlModel.findOne({});
    if (!project) {
      return res.status(404).send('No project found');
    }
    res.status(200).json({currentProject: project.currentProject});
  } catch (error) {
    res.status(500).send('Error fetching current project');
  };
};

// demokit utmaps api
// http://localhost:4000/sensor/insertDemokitUtmapsData?projectName=DEMOKIT01&sensor1=[insertData]&sensor2=[insertData]&sensor3=[insertData]&sensor4=[insertData]

export const insertDemokitUtmapsData = async (req,res) => {

    const {projectName, sensor1, sensor2, sensor3, sensor4} = req.query;

    if ( !projectName || !sensor1 || !sensor2 || !sensor3 || !sensor4 ) {
        return res.status(400).json({ error: 'Missing required parameters'});
    }


    
    try {
      const demokitUtmapsData = {
        ProjectName : projectName,
        Sensor1: sensor1,
        Sensor2: sensor2,
        Sensor3: sensor3,
        Sensor4: sensor4,
      };
      await demokitUtmapsModel.create(demokitUtmapsData);
      res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const getDemokitUtmapsData = async (req,res) => {
    try {
      const projectName = req.query.projectNumber;
      const limit = parseInt(req.query.limit);
      const unit = req.query.unit;

      // console.log('unit', unit);

      const demokitUtmapsData = await demokitUtmapsModel
        .find({ ProjectName: projectName })
        .sort({ _id: -1 })
        .limit(limit);

      if (demokitUtmapsData.length > 0) {
        if(unit === 'F') {
          demokitUtmapsData.forEach((data) => {
            data.Sensor1 = ((parseFloat(data.Sensor1) * 9/5) + 32).toFixed(1);
            data.Sensor2 = ((parseFloat(data.Sensor2) * 9/5) + 32).toFixed(1);
          });
        } else if(unit === 'K') {
          demokitUtmapsData.forEach((data) => {
            data.Sensor1 = (parseFloat(data.Sensor1) + 273.15).toFixed(1);
            data.Sensor2 = (parseFloat(data.Sensor2) + 273.15).toFixed(1);
            // console.log(data.Sensor1)
          })
        }
        
        res.json({ success: true, data: demokitUtmapsData });
      } else {
        res.json({ success: false, message: "Utmaps Data not found" });
      }
    } catch (error) {
      res.status(500).json({ error });
    };
};

export const getDemokitUtmapsReport = async (req,res) => {
    try {
        const {fromDate, toDate, projectName} = req.query;

        let query = {ProjectName : projectName};

        if (fromDate && toDate) {
            const newToDay = new Date(toDate);
            newToDay.setDate(newToDay.getDate() + 1);
            query.createdAt = { $gte: new Date(fromDate), $lte: newToDay };
        } 

        const demokitUtmapsReport = await demokitUtmapsModel
          .find(query)
          .sort({ _id: -1 });

        if (demokitUtmapsReport.length > 0) {
            res.json({success: true, data: demokitUtmapsReport});
        } else {
            res.json({success: false, message: 'Utmaps data not found'});
        }
    } catch(error) {
        res.status(500).json({error});
    };
};

// http://localhost:4000/sensor/setInitialDemokitUtmapsModelLimit?projectNumber=[projectNumber]&modelLimitS1=[modelLimitS1]&modelLimitS2=[modelLimitS2]
export const setInitialDemokitUtmapsModelLimit = async(req, res) =>{
  const {projectNumber, modelLimitS1, modelLimitS2 } = req.query;

  try {
    await demokitUtmapsIndicationModel.create({
      ProjectNumber: projectNumber,
      ModelLimitS1: modelLimitS1,
      ModelLimitS2: modelLimitS2,
    });
    res.status(200).json({message: "Initial model limit set successfully"});
  } catch(error) {
    res.status(500).json({error});
  };
};

export const getDemokitUtmapsModelLimit = async(req, res) => {
  const { projectNumber } = req.body;

  try {
    const limit = await demokitUtmapsIndicationModel.findOne({ProjectNumber: projectNumber});
    if(limit) {
      res.status(200).json({
        success: true,
        data: {
          ModelLimitS1: limit.ModelLimitS1,
          ModelLimitS2: limit.ModelLimitS2,
        },
      });
    } else {
      res.status(404).json({message: 'cant get limit'});
    }
  } catch (error) {
    res.status(500).send("Error fetching model limit");
  }
};

export const updateDemokitUtmapsModelLimit = async (req, res) => {
  const { projectNumber, modelLimitS1, modelLimitS2 } = req.body;

  try {
    const updateFields = {};
    if (modelLimitS1 && modelLimitS1.trim() !== "") {
      updateFields.ModelLimitS1 = modelLimitS1;
    }
    if (modelLimitS2 && modelLimitS2.trim() !== "") {
      updateFields.ModelLimitS2 = modelLimitS2;
    }

    await demokitUtmapsIndicationModel.findOneAndUpdate(
      { ProjectNumber: projectNumber },
      { $set: updateFields },
      { new: true, upsert: true }
    );
    res.status(200).send("Model Limit updated successfully");
  } catch (error) {
    res.status(500).send("Error updating limit");
  }
}

// demokit ports api
// http://localhost:4000/sensor/insertDemokitPortsData?projectName=DEMOKIT01&temperature=[insertData]&density=[insertData]&viscosity=[insertData]

export const insertDemokitPortsData = async (req,res) => {
    const {projectName, temperature, density, viscosity} = req.query;

    if( !projectName || !temperature || !density || !viscosity ) {
        return res.status(400).json({ error: 'Missing required parameters'});
    }
    try {
      const demokitPortsData = {
        ProjectName : projectName,
        Temperature: temperature,
        Density: density,
        Viscosity: viscosity,
      };
      await demokitPortsModel.create(demokitPortsData);
      res.status(200).json({ message: "Data inserted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const getDemokitPortsData = async (req, res) => {
  try {
    const projectName = req.query.projectNumber;
    const limit = parseInt(req.query.limit);

    const demokitPortsData = await demokitPortsModel
      .find({ ProjectName: projectName })
      .sort({ _id: -1 })
      .limit(limit);

    if (demokitPortsData.length > 0) {
      res.json({ success: true, data: demokitPortsData });
    } else {
      res.json({ success: false, message: "Ports Data not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getDemokitPortsReport = async (req, res) => {
  try {
    const { fromDate, toDate, projectName } = req.query;

    let query = { ProjectName: projectName };

    if (fromDate && toDate) {
      const newToDay = new Date(toDate);
      newToDay.setDate(newToDay.getDate() + 1);
      query.createdAt = { $gte: new Date(fromDate), $lte: newToDay };
    }

    const demokitPortsReport = await demokitPortsModel
      .find(query)
      .sort({ _id: -1 });

    if (demokitPortsReport.length > 0) {
      res.json({ success: true, data: demokitPortsReport });
    } else {
      res.json({ success: false, message: "Ports data not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// demokit ztar api
// http://localhost:4000/sensor/insertDemokitZtarData?projectName=DEMOKIT01&level=[insertData]

export const insertDemokitZtarData = async (req, res) => {
  const { projectName, level } = req.query;

  if (!level) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  try {
    const demokitZtarData = {
      ProjectName: projectName,
      Level: level,
    };
    await demokitZtarModel.create(demokitZtarData);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDemokitZtarData = async (req, res) => {
  try {
    const projectName = req.query.projectNumber;
    const limit = parseInt(req.query.limit);

    const demokitZtarData = await demokitZtarModel
      .find({ ProjectName: projectName })
      .sort({ _id: -1 })
      .limit(limit);

    if (demokitZtarData.length > 0) {
      res.json({ success: true, data: demokitZtarData });
    } else {
      res.json({ success: false, message: "Ztar Data not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getDemokitZtarReport = async (req, res) => {
  try {
    const { fromDate, toDate, projectName } = req.query;

    let query = { ProjectName: projectName };

    if (fromDate && toDate) {
      const newToDay = new Date(toDate);
      newToDay.setDate(newToDay.getDate() + 1);
      query.createdAt = { $gte: new Date(fromDate), $lte: newToDay };
    }

    const demokitZtarReport = await demokitZtarModel
      .find(query)
      .sort({ _id: -1 });

    if (demokitZtarReport.length > 0) {
      res.json({ success: true, data: demokitZtarReport });
    } else {
      res.json({ success: false, message: "Ztar data not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};