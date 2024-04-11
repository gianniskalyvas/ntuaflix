const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mock = new MockAdapter(axios);

const cliClientPath = path.resolve(__dirname, '../index.js');
const cliCommand = 'se2313';

describe('CLI Client Functional Tests', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('should login successfully and save authToken to file', () => {
    const email = 'el19105@mail.ntua.gr';
    const password = '45f9af83daebd654371c2f077b9503cf55254bc568148a8cffa320b97c369574';
  
    mock.onPost('https://localhost:9876/ntuaflix_app/userlogin').reply(200, { authToken: 'mocked-auth-token' });
  
    const output = execSync(`${cliCommand} -s login -e ${email} -p ${password}`);
  
    expect(output.toString()).toContain('Login successful. Authentication token saved.');
    const tokenFilePath = path.join(process.cwd(), '/authToken.txt');
    const fileStats = fs.statSync(tokenFilePath);
    expect(fileStats.isFile()).toBe(true);
    expect(fileStats.size).toBeGreaterThan(0);
  });

  it('should handle healthcheck successfully', () => {
    mock.onPost('https://localhost:9876/ntuaflix_app/admin/healthcheck').reply(200);

    const output = execSync(`${cliCommand} -s healthcheck`);

    expect(output.toString()).toContain('Database connection is healthy');
  });

  it('should handle titleId request', () => {
    const titleId = 'tt0000929';
    const titleData = { titleId, title: 'Klebolin klebt alles' };

    mock.onGet(`https://localhost:9876/ntuaflix_app/title/${titleId}`).reply(200, titleData);

    const output = execSync(`${cliCommand} -s titleId --titleID ${titleId}`);

    expect(output.toString()).toContain(`"titleID": "${titleId}"`);
    expect(output.toString()).toContain(`"originalTitle": "Klebolin klebt alles"`);
  });

  it('should handle searchTitle request', () => {
    const titlePart = 'Klebolin';
    const searchData = [{ title: 'Klebolin Movie' }];

    mock.onPost(`https://localhost:9876/ntuaflix_app/searchTitle?titlePart=${encodeURIComponent(titlePart)}`).reply(200, searchData);

    const output = execSync(`${cliCommand} -s searchTitle --titlePart ${titlePart}`);

    expect(output.toString()).toContain(`"originalTitle": "Klebolin klebt alles"`);
  });

  it('should handle byGenre request', () => {
    const genre = 'Action';
    const min = 0;
    const from = 1990;
    const to = 1992;
    const requestData = [{ title: 'Bloody Hero' }];

    mock.onPost('https://localhost:9876/ntuaflix_app/byGenre').reply(200, requestData);

    const output = execSync(`${cliCommand} -s byGenre --genre ${genre} --min ${min} --from ${from} --to ${to}`);

    expect(output.toString()).toContain(`"originalTitle": "Air America"`);
  });

  it('should handle nameId request', () => {
    const nameID = 'nm0000019';
    const nameData = { nameId: nameID, name: 'Federico Fellini' };

    mock.onGet(`https://localhost:9876/ntuaflix_app/name/${nameID}`).reply(200, nameData);

    const output = execSync(`${cliCommand} -s nameId --nameID ${nameID}`);

    expect(output.toString()).toContain(`"nameID": "${nameID}"`);
    expect(output.toString()).toContain(`"name": "Federico Fellini"`);
  });

  it('should handle searchName request', () => {
    const namePart = 'Federico';
    const searchData = [{ name: 'Federico Fellini' }];

    mock.onPost(`https://localhost:9876/ntuaflix_app/searchName?namePart=${encodeURIComponent(namePart)}`).reply(200, searchData);

    const output = execSync(`${cliCommand} -s searchName --namePart ${namePart}`);

    expect(output.toString()).toContain(`"name": "Federico Fellini"`);
  });
  it('should handle file upload for titlebasics', () => {
    const filePath = './truncated_title.basics.tsv';
    const responseData = { message: 'Titlebasics upload successfull.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/titlebasics').reply(200, responseData);

    const output = execSync(`${cliCommand} -s titlebasics --file ${filePath}`);

    expect(output.toString()).toContain('titlebasics upload successful.');
  });

  it('should handle file upload for titleakas', () => {
    const filePath = './truncated_title.akas.tsv';
    const responseData = { message: 'Title akas file uploaded successfully.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/titleakas').reply(200, responseData);

    const output = execSync(`${cliCommand} -s titleakas --file ${filePath}`);

    expect(output.toString()).toContain('titleakas upload successful.');
});

it('should handle file upload for namebasics', () => {
    const filePath = './truncated_name.basics.tsv';
    const responseData = { message: 'Name basics file uploaded successfully.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/namebasics').reply(200, responseData);

    const output = execSync(`${cliCommand} -s namebasics --file ${filePath}`);

    expect(output.toString()).toContain('namebasics upload successful.');
});

it('should handle file upload for titlecrew', () => {
    const filePath = './truncated_title.crew.tsv';
    const responseData = { message: 'Titlecrew upload successfull.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/titlecrew').reply(200, responseData);

    const output = execSync(`${cliCommand} -s titlecrew --file ${filePath}`);

    expect(output.toString()).toContain('titlecrew upload successful.');
});

it('should handle file upload for titleepisode', () => {
    const filePath = './truncated_title.episode.tsv';
    const responseData = { message: 'Title episode file uploaded successfully.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/titleepisode').reply(200, responseData);

    const output = execSync(`${cliCommand} -s titleepisode --file ${filePath}`);

    expect(output.toString()).toContain('titleepisode upload successful.');
});

it('should handle file upload for titleprincipals', () => {
    const filePath = './truncated_title.principals.tsv';
    const responseData = { message: 'Title principals file uploaded successfully.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/titleprincipals').reply(200, responseData);

    const output = execSync(`${cliCommand} -s titleprincipals --file ${filePath}`);

    expect(output.toString()).toContain('titleprincipals upload successful.');
});

it('should handle file upload for titleratings', () => {
    const filePath = './truncated_title.ratings.tsv';
    const responseData = { message: 'Title ratings file uploaded successfully.' };

    mock.onPost('https://localhost:9876/ntuaflix_app/admin/upload/titleratings').reply(200, responseData);

    const output = execSync(`${cliCommand} -s titleratings --file ${filePath}`);

    expect(output.toString()).toContain('titleratings upload successful.');
});

it('should handle resetall successfully', () => {
  const responseData = { message: 'Database reset successful.' };

  mock.onPost('https://localhost:9876/ntuaflix_app/admin/resetall').reply(200,responseData);

  const output = execSync(`${cliCommand} -s resetall`);

  expect(output.toString()).toContain('Database tables reset successfully.');
});

it('should handle logout successfully', () => {
  console.log('here');

  const output = execSync(`${cliCommand} -s logout`);

  expect(output.toString()).toContain('Logout successful. Authentication token cleared.');
});

});

