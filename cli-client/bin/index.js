#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const yargs = require('yargs');
const path = require('path');
const https = require('https');

const apiUrl = 'https://localhost:9876/ntuaflix_app';
let authToken = null;

axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
 

const tokenFilePath = path.join(process.cwd(), '/authToken.txt');

const saveTokenToFile = (token) => {
  fs.writeFileSync(tokenFilePath, token);
};

const readTokenFromFile = () => {
  try {
    return fs.readFileSync(tokenFilePath, 'utf-8').trim();
  } catch (error) {
    return null;
  }
};

const createTokenFileIfNotExists = () => {
  if (!fs.existsSync(tokenFilePath)) {
    fs.writeFileSync(tokenFilePath, '');  // Create an empty file
  }
};

// Ensure the token file exists when the script starts
createTokenFileIfNotExists();

// Load the authToken from the file when the script starts
authToken = readTokenFromFile();


const login = async (email, password_hash) => {
  try {
    const response = await axios.post(
      `${apiUrl}/login`,
      {
        email: email,
        password_hash: password_hash,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        transformRequest: [(email, password_hash) => JSON.stringify(email, password_hash)],
      }
    );

    authToken = response.data;
    saveTokenToFile(authToken);
    console.log('Login successful. Authentication token saved.');
    return authToken;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw new Error('Login failed. Check your credentials.');
  }
};

const logout = () => {
  authToken = null;
  fs.writeFileSync(tokenFilePath, '');
  console.log('Logout successful. Authentication token cleared.');
};

const makeAPICall = async (argv) => {
  const { username, email, password_hash, file, scope, titleID, titlePart, genre, min, from, to, nameID, namePart } = argv;
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  // If not a login request and authToken is not available, exit
  if (scope !== 'login' && !authToken) {
    console.error('Authentication token is required. Please log in.');
    process.exit(1);
  }


  try {
    switch (scope) {
      case 'login':
        if (!email || !password_hash) {
         console.error('Both email and password are required for the "login" scope.');
         process.exit(1);
       }
         authToken = await login(email, password_hash);
        break;

      case 'logout':
        logout();
        break;

      case 'healthcheck':
        const healthcheckRensponse = await axios.get(`${apiUrl}/admin/healthcheck`, { headers });
        displayResult(healthcheckRensponse.data);
        break;

      case 'titleId':
        const { titleID } = argv;
        if (!titleID) {
          console.error('TitleID parameter is required for the "title" scope.');
          process.exit(1);
        }
        const titleResponse = await axios.get(`${apiUrl}/title/${titleID}`, { headers });
        displayResult(titleResponse.data);
        break;

      case 'searchTitle':
        if (!titlePart) {
          console.error('TitlePart parameter is required for the "searchtitle" scope.');
          process.exit(1);
        }
        const searchTitleResponse = await axios.post(
          `${apiUrl}/searchTitle?titlePart=${encodeURIComponent(titlePart)}`,
          { headers }
        );
        displayResult(searchTitleResponse.data);
        break;

        case 'byGenre':
          const { genre, min, from, to } = argv;
          if (!genre) {
            console.error('Genre parameter is required for the "bygenre" scope.');
            process.exit(1);
          }
        
          const dataToSend = {
            qgenre: genre,
            minrating: min,
            yrfrom: from,
            yrto: to,
          };
          const queryString = Object.keys(dataToSend)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(dataToSend[key])}`)
        .join('&');
          
          const byGenreResponse = await axios.post(`${apiUrl}/byGenre?${queryString}`, { headers });
          displayResult(byGenreResponse.data);
          break;

      case 'nameId':
        const { nameID } = argv;
        if (!nameID) {
          console.error('NameID parameter is required for the "name" scope.');
          process.exit(1);
        }
        const nameResponse = await axios.get(`${apiUrl}/name/${nameID}`, { headers });
        displayResult(nameResponse.data);
        break;

      case 'searchName':
        if (!namePart) {
          console.error('Name parameter is required for the "searchname" scope.');
          process.exit(1);
        }
        const searchNameResponse = await axios.post(`${apiUrl}/searchName?namePart=${encodeURIComponent(namePart)}`, { headers });
        displayResult(searchNameResponse.data);
        break;

      case 'titlebasics':
      case 'titleakas':
      case 'namebasics':
      case 'titlecrew':
      case 'titleepisode':
      case 'titleprincipals':
      case 'titleratings':
        const { scope, file } = argv;
          if (!file) {
            console.error('File parameter is required for upload scopes.');
              process.exit(1);
          }

        await uploadFile(scope, file, headers);   
        break;

      case 'resetall':
        const resetallResponse = await axios.post(`${apiUrl}/admin/resetall`, { headers });
        displayResult(resetallResponse.data);
        break;

        case 'adduser':
          const { newusername, newemail, newpassword, isAdmin } = argv;
          if (!newusername || !newemail || !newpassword) {
            console.error('Username, email, password and isAdmin are required for adding users.');
            process.exit(1);
          }
        
          const addUserResponse = await axios.post(
            `${apiUrl}/admin/userConf/adduser`,
            { username: newusername, email: newemail, password_hash: newpassword, isAdmin: isAdmin },
            { headers }
          );
        
          console.log(`User ${newusername} added successfully.`);
          break;

      default:
        console.error('Invalid scope.');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

const uploadFile = async (scope, file, headers) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(file));

  try {
    const response = await axios.post(
      `${apiUrl}/admin/upload/${scope}`,
      formData,
      {
        headers: {
          ...headers,
          ...formData.getHeaders(),
        },
      }
    );

    console.log(`${scope} upload successful. Response:`, response.data);
  } catch (error) {
    console.error(`Error uploading ${scope} file:`, error.response ? error.response.data : error.message);
  }
};

const displayResult = (result) => {
  console.log(JSON.stringify(result, null, 2));
};

yargs
  .scriptName('se2313')
  .version('1.0.0')
  .command('$0', 'Make an API call', {}, makeAPICall)
  .option('e', {
    alias: 'email',
    describe: 'Email for authentication',
    demandOption: false,
  })
  .option('p', {
    alias: 'password_hash',
    describe: 'Password for authentication',
    demandOption: false,
  })
  .option('s', {
    alias: 'scope',
    describe: 'Scope of the API call',
    demandOption: true,
  })
  .option('titleID', {
    describe: 'TitleID parameter for the "title" scope',
    demandOption: false,
  })
  .option('titlePart', {
    describe: 'TitlePart parameter for the "searchtitle" scope',
    demandOption: false,
  })
  .option('genre', {
    describe: 'Genre parameter for the "bygenre" scope',
    demandOption: false,
  })
  .option('min', {
    describe: 'Min parameter for the "bygenre" scope',
    demandOption: false,
  })
  .option('from', {
    describe: 'From parameter for the "bygenre" scope',
    demandOption: false,
  })
  .option('to', {
    describe: 'To parameter for the "bygenre" scope',
    demandOption: false,
  })
  .option('nameID', {
    describe: 'NameID parameter for the "name" scope',
    demandOption: false,
  })
  .option('namePart', {
    describe: 'Name parameter for the "searchname" scope',
    demandOption: false,
  })
  .option('file', {
    describe: 'File to upload',
    demandOption: false,
  })
  .option('newusername', {
    describe: 'Username for adding a user',
    demandOption: false,
  })
  .option('newpassword', {
    describe: 'Password for adding a user',
    demandOption: false,
  })
  .option('newemail', {
    describe: 'Email for adding a user',
    demandOption: false,
  })
  .option('isAdmin', {
    describe: 'Admin option for added a user',
    demandOption: false,
  })
  .help()
  .alias('h', 'help')
  .parse();



