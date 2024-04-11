import pool from "../utils/db.js";

export async function getTitle(id) {
    
  let titleObject = {
    titleID: null,
    type: null,
    originalTitle: null,
    titlePoster: null,
    startYear: null,
    endYear: null,
    genres: null,
    titleAkas: null,
    principals: null,
    rating: null,
  };
  
  const [rows] = await pool.query(`
    SELECT * 
    FROM title_basics
    WHERE title_id = ?
    `, [id]);

  const row = rows[0];

  if(row == undefined) {
    return undefined;
  }
  
  titleObject.titleID = row.title_id;
  titleObject.type = row.type;
  titleObject.originalTitle = row.originalTitle;
  titleObject.titlePoster = row.img_url;
  titleObject.startYear = row.start_year;
  titleObject.endYear = row.end_year;

  const [genres] = await pool.query(`
    SELECT * 
    FROM genres
    WHERE title_basics_title_id = ?
    `, [id]);

  let genres_list = [];

  if (genres.length == 0) {
    titleObject.genres = [];    
  }
  else{
    for (let i = 0; i < genres.length; i++) {
      let genreObject = {
        genreTitle: genres[i].genre
      };
      genres_list.push(genreObject);       
    }
    titleObject.genres = genres_list;
  }

  const [title_akas] = await pool.query(`
    SELECT title, region
    FROM title_akas
    WHERE title_basics_title_id = ?
    `, [id]);

  let title_akas_list = [];

  if(title_akas.length == 0){
    titleObject.titleAkas = [];    
  }
  else{
    for (let i = 0; i < title_akas.length; i++) {
      let titleAkasObject = {
        akaTitle: title_akas[i].title,
        regionAbbrev: title_akas[i].region
      };
      title_akas_list.push(titleAkasObject);       
    }
    titleObject.titleAkas = title_akas_list;
  }

  const [principals] = await pool.query(`
    SELECT title_principals.name_id, category, name
    FROM title_principals
    LEFT JOIN name_basics ON title_principals.name_id = name_basics.name_id    
    WHERE title_basics_title_id = ?
    `, [id]);

  let title_principals_list = [];

  if(title_akas.length == 0){
    titleObject.principals = [];    
  }
  else{
    for (let i = 0; i < principals.length; i++) {
      let principalsObject = {
        nameID: principals[i].name_id,
        name: principals[i].name,
        category: principals[i].category
      };
      title_principals_list.push(principalsObject);
    }
    titleObject.principals = title_principals_list;
  }

  const [ratings] = await pool.query(`
    SELECT avg_rating, num_votes
    FROM ratings    
    WHERE title_basics_title_id = ?
    `, [id])

  let ratingsObject;

  if(ratings.length == 0){
  ratingsObject = {
      avRating: null,
      nVotes: null
    };
  }
  else{
    ratingsObject = {
      avRating: ratings[0].avg_rating,
      nVotes: ratings[0].num_votes
    };
  }


  titleObject.rating = ratingsObject;

  return titleObject;

  }

export async function searchTitle(str){
    const [titleID] = await pool.query(`
      SELECT title_id
      FROM title_basics
      WHERE originalTitle
      LIKE ?
    `, ['%' + str + '%']);

    let titles_list = [];

    for (let i = 0; i < titleID.length; i++) {
      titles_list.push(titleID[i].title_id);                        
    }

    return titles_list;
}

export async function byGenre(genre, minrating, yrFrom, yrTo){

  const [titles] = await pool.query(`
    SELECT title_basics_title_id 
    FROM genres
    WHERE genre = ?
    `, [genre]);     

  let titles_list = [];

  for (let i = 0; i < titles.length; i++) {
    const [title_info] = await pool.query(`
      SELECT title_id, avg_rating, start_year, end_year
      FROM title_basics
      LEFT JOIN
      ratings
      ON title_basics.title_id = ratings.title_basics_title_id
      WHERE title_id = ?
      `, [titles[i].title_basics_title_id]);

    if(yrFrom == -1 && yrTo == -1) {
      if(title_info[0].avg_rating != null && title_info[0].avg_rating >= minrating) {
        titles_list.push(title_info[0].title_id);
      }
    }
    else{
      let cond1 = title_info[0].avg_rating != null && title_info[0].avg_rating >= minrating;                // selecting movies that have equal or more rating
      let cond2 = title_info[0].start_year != null && parseInt(title_info[0].start_year) >= yrFrom;        // not null starting year greater than yrFrom
      let cond3 = title_info[0].end_year == null || parseInt(title_info[0].end_year) <= yrTo;             // end_year lesser than yrTo (or null since most records have null end_year)

      if(cond1 && cond2 && cond3) {
        titles_list.push(title_info[0].title_id);
      }
    }
  }  

  return titles_list;

}



