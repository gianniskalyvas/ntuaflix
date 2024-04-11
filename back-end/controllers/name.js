import pool from "../utils/db.js";

export async function getName(id) {
    
    let nameObject = {
        nameID: null,
        name: null,
        namePoster: null,
        birthYr: null,
        deathYr: null,
        profession: null,
        nameTitles: null,
    };

    const [rows] = await pool.query(`
      SELECT * 
      FROM name_basics
      WHERE name_id = ?
    `, [id]);

    const row = rows[0];

    if(row == undefined) {
      return undefined;
    }
  
    nameObject.nameID = row.name_id;
    nameObject.name = row.name;
    nameObject.birthYr = row.birth_year;
    nameObject.deathYr = row.death_year;
    nameObject.namePoster = row.img_url;

    const [professions] = await pool.query(`
      SELECT * 
      FROM primaryProfession
      WHERE name_basics_name_id = ?
      `, [id]);

    let professions_list = [];

    if (professions.length == 0) {
      nameObject.profession = [];    
    }
    else{
      for (let i = 0; i < professions.length; i++) {
        professions_list.push(professions[i].profession);       
      }
      nameObject.profession = professions_list;
    }

    const [titles] = await pool.query(`
      SELECT title_basics_title_id, category 
      FROM title_principals
      WHERE name_id = ?
      `, [id]);

    let titles_list = [];

    if (titles.length == 0) {
      nameObject.nameTitles = [];    
    }
    else{
      for (let i = 0; i < titles.length; i++) {
        let ntitleObject = {
          titleID: titles[i].title_basics_title_id,
          category: titles[i].category
        };
        titles_list.push(ntitleObject);     
      }
      nameObject.nameTitles = titles_list;
    }

    return nameObject;
}

export async function searchName(str){
  const [nameID] = await pool.query(`
    SELECT name_id
    FROM name_basics
    WHERE name
    LIKE ?
  `, ['%' + str + '%']);

  let names_list = [];

  for (let i = 0; i < nameID.length; i++) {
    names_list.push(nameID[i].name_id);                        
  }

  return names_list;
}